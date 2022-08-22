(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/ngcc/src/ngcc_options", ["require", "exports", "@angular/compiler-cli/src/ngtsc/file_system", "@angular/compiler-cli/src/perform_compile", "@angular/compiler-cli/ngcc/src/logging/console_logger", "@angular/compiler-cli/ngcc/src/logging/logger", "@angular/compiler-cli/ngcc/src/packages/entry_point", "@angular/compiler-cli/ngcc/src/path_mappings", "@angular/compiler-cli/ngcc/src/writing/in_place_file_writer", "@angular/compiler-cli/ngcc/src/writing/new_entry_point_file_writer"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.clearTsConfigCache = exports.getSharedSetup = void 0;
    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var file_system_1 = require("@angular/compiler-cli/src/ngtsc/file_system");
    var perform_compile_1 = require("@angular/compiler-cli/src/perform_compile");
    var console_logger_1 = require("@angular/compiler-cli/ngcc/src/logging/console_logger");
    var logger_1 = require("@angular/compiler-cli/ngcc/src/logging/logger");
    var entry_point_1 = require("@angular/compiler-cli/ngcc/src/packages/entry_point");
    var path_mappings_1 = require("@angular/compiler-cli/ngcc/src/path_mappings");
    var in_place_file_writer_1 = require("@angular/compiler-cli/ngcc/src/writing/in_place_file_writer");
    var new_entry_point_file_writer_1 = require("@angular/compiler-cli/ngcc/src/writing/new_entry_point_file_writer");
    /**
     * Instantiate common utilities that are always used and fix up options with defaults, as necessary.
     *
     * NOTE: Avoid eagerly instantiating anything that might not be used when running sync/async.
     */
    function getSharedSetup(options) {
        var fileSystem = file_system_1.getFileSystem();
        var absBasePath = file_system_1.absoluteFrom(options.basePath);
        var projectPath = fileSystem.dirname(absBasePath);
        var tsConfig = options.tsConfigPath !== null ? getTsConfig(options.tsConfigPath || projectPath) : null;
        var basePath = options.basePath, targetEntryPointPath = options.targetEntryPointPath, _a = options.propertiesToConsider, propertiesToConsider = _a === void 0 ? entry_point_1.SUPPORTED_FORMAT_PROPERTIES : _a, _b = options.compileAllFormats, compileAllFormats = _b === void 0 ? true : _b, _c = options.createNewEntryPointFormats, createNewEntryPointFormats = _c === void 0 ? false : _c, _d = options.logger, logger = _d === void 0 ? new console_logger_1.ConsoleLogger(logger_1.LogLevel.info) : _d, _e = options.pathMappings, pathMappings = _e === void 0 ? path_mappings_1.getPathMappingsFromTsConfig(tsConfig, projectPath) : _e, _f = options.async, async = _f === void 0 ? false : _f, _g = options.errorOnFailedEntryPoint, errorOnFailedEntryPoint = _g === void 0 ? false : _g, _h = options.enableI18nLegacyMessageIdFormat, enableI18nLegacyMessageIdFormat = _h === void 0 ? true : _h, _j = options.invalidateEntryPointManifest, invalidateEntryPointManifest = _j === void 0 ? false : _j, tsConfigPath = options.tsConfigPath;
        if (!!targetEntryPointPath) {
            // targetEntryPointPath forces us to error if an entry-point fails.
            errorOnFailedEntryPoint = true;
        }
        checkForSolutionStyleTsConfig(fileSystem, logger, projectPath, options.tsConfigPath, tsConfig);
        return {
            basePath: basePath,
            targetEntryPointPath: targetEntryPointPath,
            propertiesToConsider: propertiesToConsider,
            compileAllFormats: compileAllFormats,
            createNewEntryPointFormats: createNewEntryPointFormats,
            logger: logger,
            pathMappings: pathMappings,
            async: async,
            errorOnFailedEntryPoint: errorOnFailedEntryPoint,
            enableI18nLegacyMessageIdFormat: enableI18nLegacyMessageIdFormat,
            invalidateEntryPointManifest: invalidateEntryPointManifest,
            tsConfigPath: tsConfigPath,
            fileSystem: fileSystem,
            absBasePath: absBasePath,
            projectPath: projectPath,
            tsConfig: tsConfig,
            getFileWriter: function (pkgJsonUpdater) { return createNewEntryPointFormats ?
                new new_entry_point_file_writer_1.NewEntryPointFileWriter(fileSystem, logger, errorOnFailedEntryPoint, pkgJsonUpdater) :
                new in_place_file_writer_1.InPlaceFileWriter(fileSystem, logger, errorOnFailedEntryPoint); },
        };
    }
    exports.getSharedSetup = getSharedSetup;
    var tsConfigCache = null;
    var tsConfigPathCache = null;
    /**
     * Get the parsed configuration object for the given `tsConfigPath`.
     *
     * This function will cache the previous parsed configuration object to avoid unnecessary processing
     * of the tsconfig.json in the case that it is requested repeatedly.
     *
     * This makes the assumption, which is true as of writing, that the contents of tsconfig.json and
     * its dependencies will not change during the life of the process running ngcc.
     */
    function getTsConfig(tsConfigPath) {
        if (tsConfigPath !== tsConfigPathCache) {
            tsConfigPathCache = tsConfigPath;
            tsConfigCache = perform_compile_1.readConfiguration(tsConfigPath);
        }
        return tsConfigCache;
    }
    function clearTsConfigCache() {
        tsConfigPathCache = null;
        tsConfigCache = null;
    }
    exports.clearTsConfigCache = clearTsConfigCache;
    function checkForSolutionStyleTsConfig(fileSystem, logger, projectPath, tsConfigPath, tsConfig) {
        if (tsConfigPath !== null && !tsConfigPath && tsConfig !== null &&
            tsConfig.rootNames.length === 0 && tsConfig.projectReferences !== undefined &&
            tsConfig.projectReferences.length > 0) {
            logger.warn("The inferred tsconfig file \"" + tsConfig.project + "\" appears to be \"solution-style\" " +
                "since it contains no root files but does contain project references.\n" +
                "This is probably not wanted, since ngcc is unable to infer settings like \"paths\" mappings from such a file.\n" +
                "Perhaps you should have explicitly specified one of the referenced projects using the --tsconfig option. For example:\n\n" +
                tsConfig.projectReferences.map(function (ref) { return "  ngcc ... --tsconfig \"" + ref.originalPath + "\"\n"; })
                    .join('') +
                "\nFind out more about solution-style tsconfig at https://devblogs.microsoft.com/typescript/announcing-typescript-3-9/#solution-style-tsconfig.\n" +
                "If you did intend to use this file, then you can hide this warning by providing it explicitly:\n\n" +
                ("  ngcc ... --tsconfig \"" + fileSystem.relative(projectPath, tsConfig.project) + "\""));
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdjY19vcHRpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL25nY2Mvc3JjL25nY2Nfb3B0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFBQTs7Ozs7O09BTUc7SUFDSCwyRUFBb0c7SUFDcEcsNkVBQWlGO0lBRWpGLHdGQUF1RDtJQUN2RCx3RUFBa0Q7SUFDbEQsbUZBQW1FO0lBQ25FLDhFQUEwRTtJQUUxRSxvR0FBaUU7SUFDakUsa0hBQThFO0lBNEk5RTs7OztPQUlHO0lBQ0gsU0FBZ0IsY0FBYyxDQUFDLE9BQW9CO1FBRWpELElBQU0sVUFBVSxHQUFHLDJCQUFhLEVBQUUsQ0FBQztRQUNuQyxJQUFNLFdBQVcsR0FBRywwQkFBWSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNuRCxJQUFNLFdBQVcsR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3BELElBQU0sUUFBUSxHQUNWLE9BQU8sQ0FBQyxZQUFZLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLFlBQVksSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBRzFGLElBQUEsUUFBUSxHQVlOLE9BQU8sU0FaRCxFQUNSLG9CQUFvQixHQVdsQixPQUFPLHFCQVhXLEVBQ3BCLEtBVUUsT0FBTyxxQkFWeUMsRUFBbEQsb0JBQW9CLG1CQUFHLHlDQUEyQixLQUFBLEVBQ2xELEtBU0UsT0FBTyxrQkFUZSxFQUF4QixpQkFBaUIsbUJBQUcsSUFBSSxLQUFBLEVBQ3hCLEtBUUUsT0FBTywyQkFSeUIsRUFBbEMsMEJBQTBCLG1CQUFHLEtBQUssS0FBQSxFQUNsQyxLQU9FLE9BQU8sT0FQZ0MsRUFBekMsTUFBTSxtQkFBRyxJQUFJLDhCQUFhLENBQUMsaUJBQVEsQ0FBQyxJQUFJLENBQUMsS0FBQSxFQUN6QyxLQU1FLE9BQU8sYUFOd0QsRUFBakUsWUFBWSxtQkFBRywyQ0FBMkIsQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLEtBQUEsRUFDakUsS0FLRSxPQUFPLE1BTEksRUFBYixLQUFLLG1CQUFHLEtBQUssS0FBQSxFQUNiLEtBSUUsT0FBTyx3QkFKc0IsRUFBL0IsdUJBQXVCLG1CQUFHLEtBQUssS0FBQSxFQUMvQixLQUdFLE9BQU8sZ0NBSDZCLEVBQXRDLCtCQUErQixtQkFBRyxJQUFJLEtBQUEsRUFDdEMsS0FFRSxPQUFPLDZCQUYyQixFQUFwQyw0QkFBNEIsbUJBQUcsS0FBSyxLQUFBLEVBQ3BDLFlBQVksR0FDVixPQUFPLGFBREcsQ0FDRjtRQUVaLElBQUksQ0FBQyxDQUFDLG9CQUFvQixFQUFFO1lBQzFCLG1FQUFtRTtZQUNuRSx1QkFBdUIsR0FBRyxJQUFJLENBQUM7U0FDaEM7UUFFRCw2QkFBNkIsQ0FBQyxVQUFVLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxPQUFPLENBQUMsWUFBWSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBRS9GLE9BQU87WUFDTCxRQUFRLFVBQUE7WUFDUixvQkFBb0Isc0JBQUE7WUFDcEIsb0JBQW9CLHNCQUFBO1lBQ3BCLGlCQUFpQixtQkFBQTtZQUNqQiwwQkFBMEIsNEJBQUE7WUFDMUIsTUFBTSxRQUFBO1lBQ04sWUFBWSxjQUFBO1lBQ1osS0FBSyxPQUFBO1lBQ0wsdUJBQXVCLHlCQUFBO1lBQ3ZCLCtCQUErQixpQ0FBQTtZQUMvQiw0QkFBNEIsOEJBQUE7WUFDNUIsWUFBWSxjQUFBO1lBQ1osVUFBVSxZQUFBO1lBQ1YsV0FBVyxhQUFBO1lBQ1gsV0FBVyxhQUFBO1lBQ1gsUUFBUSxVQUFBO1lBQ1IsYUFBYSxFQUFFLFVBQUMsY0FBa0MsSUFBSyxPQUFBLDBCQUEwQixDQUFDLENBQUM7Z0JBQy9FLElBQUkscURBQXVCLENBQUMsVUFBVSxFQUFFLE1BQU0sRUFBRSx1QkFBdUIsRUFBRSxjQUFjLENBQUMsQ0FBQyxDQUFDO2dCQUMxRixJQUFJLHdDQUFpQixDQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUUsdUJBQXVCLENBQUMsRUFGZixDQUVlO1NBQ3ZFLENBQUM7SUFDSixDQUFDO0lBbkRELHdDQW1EQztJQUVELElBQUksYUFBYSxHQUE2QixJQUFJLENBQUM7SUFDbkQsSUFBSSxpQkFBaUIsR0FBZ0IsSUFBSSxDQUFDO0lBRTFDOzs7Ozs7OztPQVFHO0lBQ0gsU0FBUyxXQUFXLENBQUMsWUFBb0I7UUFDdkMsSUFBSSxZQUFZLEtBQUssaUJBQWlCLEVBQUU7WUFDdEMsaUJBQWlCLEdBQUcsWUFBWSxDQUFDO1lBQ2pDLGFBQWEsR0FBRyxtQ0FBaUIsQ0FBQyxZQUFZLENBQUMsQ0FBQztTQUNqRDtRQUNELE9BQU8sYUFBYSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxTQUFnQixrQkFBa0I7UUFDaEMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDO1FBQ3pCLGFBQWEsR0FBRyxJQUFJLENBQUM7SUFDdkIsQ0FBQztJQUhELGdEQUdDO0lBRUQsU0FBUyw2QkFBNkIsQ0FDbEMsVUFBc0IsRUFBRSxNQUFjLEVBQUUsV0FBMkIsRUFDbkUsWUFBbUMsRUFBRSxRQUFrQztRQUN6RSxJQUFJLFlBQVksS0FBSyxJQUFJLElBQUksQ0FBQyxZQUFZLElBQUksUUFBUSxLQUFLLElBQUk7WUFDM0QsUUFBUSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLFFBQVEsQ0FBQyxpQkFBaUIsS0FBSyxTQUFTO1lBQzNFLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ3pDLE1BQU0sQ0FBQyxJQUFJLENBQ1Asa0NBQStCLFFBQVEsQ0FBQyxPQUFPLHlDQUFtQztnQkFDbEYsd0VBQXdFO2dCQUN4RSxpSEFBK0c7Z0JBQy9HLDJIQUEySDtnQkFDM0gsUUFBUSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxVQUFBLEdBQUcsSUFBSSxPQUFBLDZCQUEwQixHQUFHLENBQUMsWUFBWSxTQUFLLEVBQS9DLENBQStDLENBQUM7cUJBQ2pGLElBQUksQ0FBQyxFQUFFLENBQUM7Z0JBQ2Isa0pBQWtKO2dCQUNsSixvR0FBb0c7aUJBQ3BHLDZCQUEwQixVQUFVLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDLE9BQUcsQ0FBQSxDQUFDLENBQUM7U0FDdEY7SUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge2Fic29sdXRlRnJvbSwgQWJzb2x1dGVGc1BhdGgsIEZpbGVTeXN0ZW0sIGdldEZpbGVTeXN0ZW19IGZyb20gJy4uLy4uL3NyYy9uZ3RzYy9maWxlX3N5c3RlbSc7XG5pbXBvcnQge1BhcnNlZENvbmZpZ3VyYXRpb24sIHJlYWRDb25maWd1cmF0aW9ufSBmcm9tICcuLi8uLi9zcmMvcGVyZm9ybV9jb21waWxlJztcblxuaW1wb3J0IHtDb25zb2xlTG9nZ2VyfSBmcm9tICcuL2xvZ2dpbmcvY29uc29sZV9sb2dnZXInO1xuaW1wb3J0IHtMb2dnZXIsIExvZ0xldmVsfSBmcm9tICcuL2xvZ2dpbmcvbG9nZ2VyJztcbmltcG9ydCB7U1VQUE9SVEVEX0ZPUk1BVF9QUk9QRVJUSUVTfSBmcm9tICcuL3BhY2thZ2VzL2VudHJ5X3BvaW50JztcbmltcG9ydCB7Z2V0UGF0aE1hcHBpbmdzRnJvbVRzQ29uZmlnLCBQYXRoTWFwcGluZ3N9IGZyb20gJy4vcGF0aF9tYXBwaW5ncyc7XG5pbXBvcnQge0ZpbGVXcml0ZXJ9IGZyb20gJy4vd3JpdGluZy9maWxlX3dyaXRlcic7XG5pbXBvcnQge0luUGxhY2VGaWxlV3JpdGVyfSBmcm9tICcuL3dyaXRpbmcvaW5fcGxhY2VfZmlsZV93cml0ZXInO1xuaW1wb3J0IHtOZXdFbnRyeVBvaW50RmlsZVdyaXRlcn0gZnJvbSAnLi93cml0aW5nL25ld19lbnRyeV9wb2ludF9maWxlX3dyaXRlcic7XG5pbXBvcnQge1BhY2thZ2VKc29uVXBkYXRlcn0gZnJvbSAnLi93cml0aW5nL3BhY2thZ2VfanNvbl91cGRhdGVyJztcblxuLyoqXG4gKiBUaGUgb3B0aW9ucyB0byBjb25maWd1cmUgdGhlIG5nY2MgY29tcGlsZXIgZm9yIHN5bmNocm9ub3VzIGV4ZWN1dGlvbi5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBTeW5jTmdjY09wdGlvbnMge1xuICAvKiogVGhlIGFic29sdXRlIHBhdGggdG8gdGhlIGBub2RlX21vZHVsZXNgIGZvbGRlciB0aGF0IGNvbnRhaW5zIHRoZSBwYWNrYWdlcyB0byBwcm9jZXNzLiAqL1xuICBiYXNlUGF0aDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgcGF0aCB0byB0aGUgcHJpbWFyeSBwYWNrYWdlIHRvIGJlIHByb2Nlc3NlZC4gSWYgbm90IGFic29sdXRlIHRoZW4gaXQgbXVzdCBiZSByZWxhdGl2ZSB0b1xuICAgKiBgYmFzZVBhdGhgLlxuICAgKlxuICAgKiBBbGwgaXRzIGRlcGVuZGVuY2llcyB3aWxsIG5lZWQgdG8gYmUgcHJvY2Vzc2VkIHRvby5cbiAgICpcbiAgICogSWYgdGhpcyBwcm9wZXJ0eSBpcyBwcm92aWRlZCB0aGVuIGBlcnJvck9uRmFpbGVkRW50cnlQb2ludGAgaXMgZm9yY2VkIHRvIHRydWUuXG4gICAqL1xuICB0YXJnZXRFbnRyeVBvaW50UGF0aD86IHN0cmluZztcblxuICAvKipcbiAgICogV2hpY2ggZW50cnktcG9pbnQgcHJvcGVydGllcyBpbiB0aGUgcGFja2FnZS5qc29uIHRvIGNvbnNpZGVyIHdoZW4gcHJvY2Vzc2luZyBhbiBlbnRyeS1wb2ludC5cbiAgICogRWFjaCBwcm9wZXJ0eSBzaG91bGQgaG9sZCBhIHBhdGggdG8gdGhlIHBhcnRpY3VsYXIgYnVuZGxlIGZvcm1hdCBmb3IgdGhlIGVudHJ5LXBvaW50LlxuICAgKiBEZWZhdWx0cyB0byBhbGwgdGhlIHByb3BlcnRpZXMgaW4gdGhlIHBhY2thZ2UuanNvbi5cbiAgICovXG4gIHByb3BlcnRpZXNUb0NvbnNpZGVyPzogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gcHJvY2VzcyBhbGwgZm9ybWF0cyBzcGVjaWZpZWQgYnkgKGBwcm9wZXJ0aWVzVG9Db25zaWRlcmApICBvciB0byBzdG9wIHByb2Nlc3NpbmdcbiAgICogdGhpcyBlbnRyeS1wb2ludCBhdCB0aGUgZmlyc3QgbWF0Y2hpbmcgZm9ybWF0LiBEZWZhdWx0cyB0byBgdHJ1ZWAuXG4gICAqL1xuICBjb21waWxlQWxsRm9ybWF0cz86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gY3JlYXRlIG5ldyBlbnRyeS1wb2ludHMgYnVuZGxlcyByYXRoZXIgdGhhbiBvdmVyd3JpdGluZyB0aGUgb3JpZ2luYWwgZmlsZXMuXG4gICAqL1xuICBjcmVhdGVOZXdFbnRyeVBvaW50Rm9ybWF0cz86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFByb3ZpZGUgYSBsb2dnZXIgdGhhdCB3aWxsIGJlIGNhbGxlZCB3aXRoIGxvZyBtZXNzYWdlcy5cbiAgICovXG4gIGxvZ2dlcj86IExvZ2dlcjtcblxuICAvKipcbiAgICogUGF0aHMgbWFwcGluZyBjb25maWd1cmF0aW9uIChgcGF0aHNgIGFuZCBgYmFzZVVybGApLCBhcyBmb3VuZCBpbiBgdHMuQ29tcGlsZXJPcHRpb25zYC5cbiAgICogVGhlc2UgYXJlIHVzZWQgdG8gcmVzb2x2ZSBwYXRocyB0byBsb2NhbGx5IGJ1aWx0IEFuZ3VsYXIgbGlicmFyaWVzLlxuICAgKlxuICAgKiBOb3RlIHRoYXQgYHBhdGhNYXBwaW5nc2Agc3BlY2lmaWVkIGhlcmUgdGFrZSBwcmVjZWRlbmNlIG92ZXIgYW55IGBwYXRoTWFwcGluZ3NgIGxvYWRlZCBmcm9tIGFcbiAgICogVFMgY29uZmlnIGZpbGUuXG4gICAqL1xuICBwYXRoTWFwcGluZ3M/OiBQYXRoTWFwcGluZ3M7XG5cbiAgLyoqXG4gICAqIFByb3ZpZGUgYSBmaWxlLXN5c3RlbSBzZXJ2aWNlIHRoYXQgd2lsbCBiZSB1c2VkIGJ5IG5nY2MgZm9yIGFsbCBmaWxlIGludGVyYWN0aW9ucy5cbiAgICovXG4gIGZpbGVTeXN0ZW0/OiBGaWxlU3lzdGVtO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBjb21waWxhdGlvbiBzaG91bGQgcnVuIGFuZCByZXR1cm4gYXN5bmNocm9ub3VzbHkuIEFsbG93aW5nIGFzeW5jaHJvbm91cyBleGVjdXRpb25cbiAgICogbWF5IHNwZWVkIHVwIHRoZSBjb21waWxhdGlvbiBieSB1dGlsaXppbmcgbXVsdGlwbGUgQ1BVIGNvcmVzIChpZiBhdmFpbGFibGUpLlxuICAgKlxuICAgKiBEZWZhdWx0OiBgZmFsc2VgIChpLmUuIHJ1biBzeW5jaHJvbm91c2x5KVxuICAgKi9cbiAgYXN5bmM/OiBmYWxzZTtcblxuICAvKipcbiAgICogU2V0IHRvIHRydWUgaW4gb3JkZXIgdG8gdGVybWluYXRlIGltbWVkaWF0ZWx5IHdpdGggYW4gZXJyb3IgY29kZSBpZiBhbiBlbnRyeS1wb2ludCBmYWlscyB0byBiZVxuICAgKiBwcm9jZXNzZWQuXG4gICAqXG4gICAqIElmIGB0YXJnZXRFbnRyeVBvaW50UGF0aGAgaXMgcHJvdmlkZWQgdGhlbiB0aGlzIHByb3BlcnR5IGlzIGFsd2F5cyB0cnVlIGFuZCBjYW5ub3QgYmVcbiAgICogY2hhbmdlZC4gT3RoZXJ3aXNlIHRoZSBkZWZhdWx0IGlzIGZhbHNlLlxuICAgKlxuICAgKiBXaGVuIHNldCB0byBmYWxzZSwgbmdjYyB3aWxsIGNvbnRpbnVlIHRvIHByb2Nlc3MgZW50cnktcG9pbnRzIGFmdGVyIGEgZmFpbHVyZS4gSW4gd2hpY2ggY2FzZSBpdFxuICAgKiB3aWxsIGxvZyBhbiBlcnJvciBhbmQgcmVzdW1lIHByb2Nlc3Npbmcgb3RoZXIgZW50cnktcG9pbnRzLlxuICAgKi9cbiAgZXJyb3JPbkZhaWxlZEVudHJ5UG9pbnQ/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBSZW5kZXIgYCRsb2NhbGl6ZWAgbWVzc2FnZXMgd2l0aCBsZWdhY3kgZm9ybWF0IGlkcy5cbiAgICpcbiAgICogVGhlIGRlZmF1bHQgdmFsdWUgaXMgYHRydWVgLiBPbmx5IHNldCB0aGlzIHRvIGBmYWxzZWAgaWYgeW91IGRvIG5vdCB3YW50IGxlZ2FjeSBtZXNzYWdlIGlkcyB0b1xuICAgKiBiZSByZW5kZXJlZC4gRm9yIGV4YW1wbGUsIGlmIHlvdSBhcmUgbm90IHVzaW5nIGxlZ2FjeSBtZXNzYWdlIGlkcyBpbiB5b3VyIHRyYW5zbGF0aW9uIGZpbGVzXG4gICAqIEFORCBhcmUgbm90IGRvaW5nIGNvbXBpbGUtdGltZSBpbmxpbmluZyBvZiB0cmFuc2xhdGlvbnMsIGluIHdoaWNoIGNhc2UgdGhlIGV4dHJhIG1lc3NhZ2UgaWRzXG4gICAqIHdvdWxkIGFkZCB1bndhbnRlZCBzaXplIHRvIHRoZSBmaW5hbCBzb3VyY2UgYnVuZGxlLlxuICAgKlxuICAgKiBJdCBpcyBzYWZlIHRvIGxlYXZlIHRoaXMgc2V0IHRvIHRydWUgaWYgeW91IGFyZSBkb2luZyBjb21waWxlLXRpbWUgaW5saW5pbmcgYmVjYXVzZSB0aGUgZXh0cmFcbiAgICogbGVnYWN5IG1lc3NhZ2UgaWRzIHdpbGwgYWxsIGJlIHN0cmlwcGVkIGR1cmluZyB0cmFuc2xhdGlvbi5cbiAgICovXG4gIGVuYWJsZUkxOG5MZWdhY3lNZXNzYWdlSWRGb3JtYXQ/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIGludmFsaWRhdGUgYW55IGVudHJ5LXBvaW50IG1hbmlmZXN0IGZpbGUgdGhhdCBpcyBvbiBkaXNrLiBJbnN0ZWFkLCB3YWxrIHRoZVxuICAgKiBkaXJlY3RvcnkgdHJlZSBsb29raW5nIGZvciBlbnRyeS1wb2ludHMsIGFuZCB0aGVuIHdyaXRlIGEgbmV3IGVudHJ5LXBvaW50IG1hbmlmZXN0LCBpZlxuICAgKiBwb3NzaWJsZS5cbiAgICpcbiAgICogRGVmYXVsdDogYGZhbHNlYCAoaS5lLiB0aGUgbWFuaWZlc3Qgd2lsbCBiZSB1c2VkIGlmIGF2YWlsYWJsZSlcbiAgICovXG4gIGludmFsaWRhdGVFbnRyeVBvaW50TWFuaWZlc3Q/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBBbiBhYnNvbHV0ZSBwYXRoIHRvIGEgVFMgY29uZmlnIGZpbGUgKGUuZy4gYHRzY29uZmlnLmpzb25gKSBvciBhIGRpcmVjdG9yeSBjb250YWluaW5nIG9uZSwgdGhhdFxuICAgKiB3aWxsIGJlIHVzZWQgdG8gY29uZmlndXJlIG1vZHVsZSByZXNvbHV0aW9uIHdpdGggdGhpbmdzIGxpa2UgcGF0aCBtYXBwaW5ncywgaWYgbm90IHNwZWNpZmllZFxuICAgKiBleHBsaWNpdGx5IHZpYSB0aGUgYHBhdGhNYXBwaW5nc2AgcHJvcGVydHkgdG8gYG1haW5OZ2NjYC5cbiAgICpcbiAgICogSWYgYHVuZGVmaW5lZGAsIG5nY2Mgd2lsbCBhdHRlbXB0IHRvIGxvYWQgYSBgdHNjb25maWcuanNvbmAgZmlsZSBmcm9tIHRoZSBkaXJlY3RvcnkgYWJvdmUgdGhlXG4gICAqIGBiYXNlUGF0aGAuXG4gICAqXG4gICAqIElmIGBudWxsYCwgbmdjYyB3aWxsIG5vdCBhdHRlbXB0IHRvIGxvYWQgYW55IFRTIGNvbmZpZyBmaWxlIGF0IGFsbC5cbiAgICovXG4gIHRzQ29uZmlnUGF0aD86IHN0cmluZ3xudWxsO1xuXG4gIC8qKlxuICAgKiBVc2UgdGhlIHByb2dyYW0gZGVmaW5lZCBpbiB0aGUgbG9hZGVkIHRzY29uZmlnLmpzb24gKGlmIGF2YWlsYWJsZSAtIHNlZVxuICAgKiBgdHNDb25maWdQYXRoYCBvcHRpb24pIHRvIGlkZW50aWZ5IHRoZSBlbnRyeS1wb2ludHMgdGhhdCBzaG91bGQgYmUgcHJvY2Vzc2VkLlxuICAgKiBJZiB0aGlzIGlzIHNldCB0byBgdHJ1ZWAgdGhlbiBvbmx5IHRoZSBlbnRyeS1wb2ludHMgcmVhY2hhYmxlIGZyb20gdGhlIGdpdmVuXG4gICAqIHByb2dyYW0gKGFuZCB0aGVpciBkZXBlbmRlbmNpZXMpIHdpbGwgYmUgcHJvY2Vzc2VkLlxuICAgKi9cbiAgZmluZEVudHJ5UG9pbnRzRnJvbVRzQ29uZmlnUHJvZ3JhbT86IGJvb2xlYW47XG59XG5cbi8qKlxuICogVGhlIG9wdGlvbnMgdG8gY29uZmlndXJlIHRoZSBuZ2NjIGNvbXBpbGVyIGZvciBhc3luY2hyb25vdXMgZXhlY3V0aW9uLlxuICovXG5leHBvcnQgdHlwZSBBc3luY05nY2NPcHRpb25zID0gT21pdDxTeW5jTmdjY09wdGlvbnMsICdhc3luYyc+Jnthc3luYzogdHJ1ZX07XG5cbi8qKlxuICogVGhlIG9wdGlvbnMgdG8gY29uZmlndXJlIHRoZSBuZ2NjIGNvbXBpbGVyLlxuICovXG5leHBvcnQgdHlwZSBOZ2NjT3B0aW9ucyA9IEFzeW5jTmdjY09wdGlvbnN8U3luY05nY2NPcHRpb25zO1xuXG5leHBvcnQgdHlwZSBPcHRpb25hbE5nY2NPcHRpb25LZXlzID1cbiAgICAndGFyZ2V0RW50cnlQb2ludFBhdGgnfCd0c0NvbmZpZ1BhdGgnfCdwYXRoTWFwcGluZ3MnfCdmaW5kRW50cnlQb2ludHNGcm9tVHNDb25maWdQcm9ncmFtJztcbmV4cG9ydCB0eXBlIFJlcXVpcmVkTmdjY09wdGlvbnMgPSBSZXF1aXJlZDxPbWl0PE5nY2NPcHRpb25zLCBPcHRpb25hbE5nY2NPcHRpb25LZXlzPj47XG5leHBvcnQgdHlwZSBPcHRpb25hbE5nY2NPcHRpb25zID0gUGljazxOZ2NjT3B0aW9ucywgT3B0aW9uYWxOZ2NjT3B0aW9uS2V5cz47XG5leHBvcnQgdHlwZSBTaGFyZWRTZXR1cCA9IHtcbiAgZmlsZVN5c3RlbTogRmlsZVN5c3RlbTsgYWJzQmFzZVBhdGg6IEFic29sdXRlRnNQYXRoOyBwcm9qZWN0UGF0aDogQWJzb2x1dGVGc1BhdGg7XG4gIHRzQ29uZmlnOiBQYXJzZWRDb25maWd1cmF0aW9uIHwgbnVsbDtcbiAgZ2V0RmlsZVdyaXRlcihwa2dKc29uVXBkYXRlcjogUGFja2FnZUpzb25VcGRhdGVyKTogRmlsZVdyaXRlcjtcbn07XG5cbi8qKlxuICogSW5zdGFudGlhdGUgY29tbW9uIHV0aWxpdGllcyB0aGF0IGFyZSBhbHdheXMgdXNlZCBhbmQgZml4IHVwIG9wdGlvbnMgd2l0aCBkZWZhdWx0cywgYXMgbmVjZXNzYXJ5LlxuICpcbiAqIE5PVEU6IEF2b2lkIGVhZ2VybHkgaW5zdGFudGlhdGluZyBhbnl0aGluZyB0aGF0IG1pZ2h0IG5vdCBiZSB1c2VkIHdoZW4gcnVubmluZyBzeW5jL2FzeW5jLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2hhcmVkU2V0dXAob3B0aW9uczogTmdjY09wdGlvbnMpOiBTaGFyZWRTZXR1cCZSZXF1aXJlZE5nY2NPcHRpb25zJlxuICAgIE9wdGlvbmFsTmdjY09wdGlvbnMge1xuICBjb25zdCBmaWxlU3lzdGVtID0gZ2V0RmlsZVN5c3RlbSgpO1xuICBjb25zdCBhYnNCYXNlUGF0aCA9IGFic29sdXRlRnJvbShvcHRpb25zLmJhc2VQYXRoKTtcbiAgY29uc3QgcHJvamVjdFBhdGggPSBmaWxlU3lzdGVtLmRpcm5hbWUoYWJzQmFzZVBhdGgpO1xuICBjb25zdCB0c0NvbmZpZyA9XG4gICAgICBvcHRpb25zLnRzQ29uZmlnUGF0aCAhPT0gbnVsbCA/IGdldFRzQ29uZmlnKG9wdGlvbnMudHNDb25maWdQYXRoIHx8IHByb2plY3RQYXRoKSA6IG51bGw7XG5cbiAgbGV0IHtcbiAgICBiYXNlUGF0aCxcbiAgICB0YXJnZXRFbnRyeVBvaW50UGF0aCxcbiAgICBwcm9wZXJ0aWVzVG9Db25zaWRlciA9IFNVUFBPUlRFRF9GT1JNQVRfUFJPUEVSVElFUyxcbiAgICBjb21waWxlQWxsRm9ybWF0cyA9IHRydWUsXG4gICAgY3JlYXRlTmV3RW50cnlQb2ludEZvcm1hdHMgPSBmYWxzZSxcbiAgICBsb2dnZXIgPSBuZXcgQ29uc29sZUxvZ2dlcihMb2dMZXZlbC5pbmZvKSxcbiAgICBwYXRoTWFwcGluZ3MgPSBnZXRQYXRoTWFwcGluZ3NGcm9tVHNDb25maWcodHNDb25maWcsIHByb2plY3RQYXRoKSxcbiAgICBhc3luYyA9IGZhbHNlLFxuICAgIGVycm9yT25GYWlsZWRFbnRyeVBvaW50ID0gZmFsc2UsXG4gICAgZW5hYmxlSTE4bkxlZ2FjeU1lc3NhZ2VJZEZvcm1hdCA9IHRydWUsXG4gICAgaW52YWxpZGF0ZUVudHJ5UG9pbnRNYW5pZmVzdCA9IGZhbHNlLFxuICAgIHRzQ29uZmlnUGF0aCxcbiAgfSA9IG9wdGlvbnM7XG5cbiAgaWYgKCEhdGFyZ2V0RW50cnlQb2ludFBhdGgpIHtcbiAgICAvLyB0YXJnZXRFbnRyeVBvaW50UGF0aCBmb3JjZXMgdXMgdG8gZXJyb3IgaWYgYW4gZW50cnktcG9pbnQgZmFpbHMuXG4gICAgZXJyb3JPbkZhaWxlZEVudHJ5UG9pbnQgPSB0cnVlO1xuICB9XG5cbiAgY2hlY2tGb3JTb2x1dGlvblN0eWxlVHNDb25maWcoZmlsZVN5c3RlbSwgbG9nZ2VyLCBwcm9qZWN0UGF0aCwgb3B0aW9ucy50c0NvbmZpZ1BhdGgsIHRzQ29uZmlnKTtcblxuICByZXR1cm4ge1xuICAgIGJhc2VQYXRoLFxuICAgIHRhcmdldEVudHJ5UG9pbnRQYXRoLFxuICAgIHByb3BlcnRpZXNUb0NvbnNpZGVyLFxuICAgIGNvbXBpbGVBbGxGb3JtYXRzLFxuICAgIGNyZWF0ZU5ld0VudHJ5UG9pbnRGb3JtYXRzLFxuICAgIGxvZ2dlcixcbiAgICBwYXRoTWFwcGluZ3MsXG4gICAgYXN5bmMsXG4gICAgZXJyb3JPbkZhaWxlZEVudHJ5UG9pbnQsXG4gICAgZW5hYmxlSTE4bkxlZ2FjeU1lc3NhZ2VJZEZvcm1hdCxcbiAgICBpbnZhbGlkYXRlRW50cnlQb2ludE1hbmlmZXN0LFxuICAgIHRzQ29uZmlnUGF0aCxcbiAgICBmaWxlU3lzdGVtLFxuICAgIGFic0Jhc2VQYXRoLFxuICAgIHByb2plY3RQYXRoLFxuICAgIHRzQ29uZmlnLFxuICAgIGdldEZpbGVXcml0ZXI6IChwa2dKc29uVXBkYXRlcjogUGFja2FnZUpzb25VcGRhdGVyKSA9PiBjcmVhdGVOZXdFbnRyeVBvaW50Rm9ybWF0cyA/XG4gICAgICAgIG5ldyBOZXdFbnRyeVBvaW50RmlsZVdyaXRlcihmaWxlU3lzdGVtLCBsb2dnZXIsIGVycm9yT25GYWlsZWRFbnRyeVBvaW50LCBwa2dKc29uVXBkYXRlcikgOlxuICAgICAgICBuZXcgSW5QbGFjZUZpbGVXcml0ZXIoZmlsZVN5c3RlbSwgbG9nZ2VyLCBlcnJvck9uRmFpbGVkRW50cnlQb2ludCksXG4gIH07XG59XG5cbmxldCB0c0NvbmZpZ0NhY2hlOiBQYXJzZWRDb25maWd1cmF0aW9ufG51bGwgPSBudWxsO1xubGV0IHRzQ29uZmlnUGF0aENhY2hlOiBzdHJpbmd8bnVsbCA9IG51bGw7XG5cbi8qKlxuICogR2V0IHRoZSBwYXJzZWQgY29uZmlndXJhdGlvbiBvYmplY3QgZm9yIHRoZSBnaXZlbiBgdHNDb25maWdQYXRoYC5cbiAqXG4gKiBUaGlzIGZ1bmN0aW9uIHdpbGwgY2FjaGUgdGhlIHByZXZpb3VzIHBhcnNlZCBjb25maWd1cmF0aW9uIG9iamVjdCB0byBhdm9pZCB1bm5lY2Vzc2FyeSBwcm9jZXNzaW5nXG4gKiBvZiB0aGUgdHNjb25maWcuanNvbiBpbiB0aGUgY2FzZSB0aGF0IGl0IGlzIHJlcXVlc3RlZCByZXBlYXRlZGx5LlxuICpcbiAqIFRoaXMgbWFrZXMgdGhlIGFzc3VtcHRpb24sIHdoaWNoIGlzIHRydWUgYXMgb2Ygd3JpdGluZywgdGhhdCB0aGUgY29udGVudHMgb2YgdHNjb25maWcuanNvbiBhbmRcbiAqIGl0cyBkZXBlbmRlbmNpZXMgd2lsbCBub3QgY2hhbmdlIGR1cmluZyB0aGUgbGlmZSBvZiB0aGUgcHJvY2VzcyBydW5uaW5nIG5nY2MuXG4gKi9cbmZ1bmN0aW9uIGdldFRzQ29uZmlnKHRzQ29uZmlnUGF0aDogc3RyaW5nKTogUGFyc2VkQ29uZmlndXJhdGlvbnxudWxsIHtcbiAgaWYgKHRzQ29uZmlnUGF0aCAhPT0gdHNDb25maWdQYXRoQ2FjaGUpIHtcbiAgICB0c0NvbmZpZ1BhdGhDYWNoZSA9IHRzQ29uZmlnUGF0aDtcbiAgICB0c0NvbmZpZ0NhY2hlID0gcmVhZENvbmZpZ3VyYXRpb24odHNDb25maWdQYXRoKTtcbiAgfVxuICByZXR1cm4gdHNDb25maWdDYWNoZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNsZWFyVHNDb25maWdDYWNoZSgpIHtcbiAgdHNDb25maWdQYXRoQ2FjaGUgPSBudWxsO1xuICB0c0NvbmZpZ0NhY2hlID0gbnVsbDtcbn1cblxuZnVuY3Rpb24gY2hlY2tGb3JTb2x1dGlvblN0eWxlVHNDb25maWcoXG4gICAgZmlsZVN5c3RlbTogRmlsZVN5c3RlbSwgbG9nZ2VyOiBMb2dnZXIsIHByb2plY3RQYXRoOiBBYnNvbHV0ZUZzUGF0aCxcbiAgICB0c0NvbmZpZ1BhdGg6IHN0cmluZ3xudWxsfHVuZGVmaW5lZCwgdHNDb25maWc6IFBhcnNlZENvbmZpZ3VyYXRpb258bnVsbCk6IHZvaWQge1xuICBpZiAodHNDb25maWdQYXRoICE9PSBudWxsICYmICF0c0NvbmZpZ1BhdGggJiYgdHNDb25maWcgIT09IG51bGwgJiZcbiAgICAgIHRzQ29uZmlnLnJvb3ROYW1lcy5sZW5ndGggPT09IDAgJiYgdHNDb25maWcucHJvamVjdFJlZmVyZW5jZXMgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgdHNDb25maWcucHJvamVjdFJlZmVyZW5jZXMubGVuZ3RoID4gMCkge1xuICAgIGxvZ2dlci53YXJuKFxuICAgICAgICBgVGhlIGluZmVycmVkIHRzY29uZmlnIGZpbGUgXCIke3RzQ29uZmlnLnByb2plY3R9XCIgYXBwZWFycyB0byBiZSBcInNvbHV0aW9uLXN0eWxlXCIgYCArXG4gICAgICAgIGBzaW5jZSBpdCBjb250YWlucyBubyByb290IGZpbGVzIGJ1dCBkb2VzIGNvbnRhaW4gcHJvamVjdCByZWZlcmVuY2VzLlxcbmAgK1xuICAgICAgICBgVGhpcyBpcyBwcm9iYWJseSBub3Qgd2FudGVkLCBzaW5jZSBuZ2NjIGlzIHVuYWJsZSB0byBpbmZlciBzZXR0aW5ncyBsaWtlIFwicGF0aHNcIiBtYXBwaW5ncyBmcm9tIHN1Y2ggYSBmaWxlLlxcbmAgK1xuICAgICAgICBgUGVyaGFwcyB5b3Ugc2hvdWxkIGhhdmUgZXhwbGljaXRseSBzcGVjaWZpZWQgb25lIG9mIHRoZSByZWZlcmVuY2VkIHByb2plY3RzIHVzaW5nIHRoZSAtLXRzY29uZmlnIG9wdGlvbi4gRm9yIGV4YW1wbGU6XFxuXFxuYCArXG4gICAgICAgIHRzQ29uZmlnLnByb2plY3RSZWZlcmVuY2VzLm1hcChyZWYgPT4gYCAgbmdjYyAuLi4gLS10c2NvbmZpZyBcIiR7cmVmLm9yaWdpbmFsUGF0aH1cIlxcbmApXG4gICAgICAgICAgICAuam9pbignJykgK1xuICAgICAgICBgXFxuRmluZCBvdXQgbW9yZSBhYm91dCBzb2x1dGlvbi1zdHlsZSB0c2NvbmZpZyBhdCBodHRwczovL2RldmJsb2dzLm1pY3Jvc29mdC5jb20vdHlwZXNjcmlwdC9hbm5vdW5jaW5nLXR5cGVzY3JpcHQtMy05LyNzb2x1dGlvbi1zdHlsZS10c2NvbmZpZy5cXG5gICtcbiAgICAgICAgYElmIHlvdSBkaWQgaW50ZW5kIHRvIHVzZSB0aGlzIGZpbGUsIHRoZW4geW91IGNhbiBoaWRlIHRoaXMgd2FybmluZyBieSBwcm92aWRpbmcgaXQgZXhwbGljaXRseTpcXG5cXG5gICtcbiAgICAgICAgYCAgbmdjYyAuLi4gLS10c2NvbmZpZyBcIiR7ZmlsZVN5c3RlbS5yZWxhdGl2ZShwcm9qZWN0UGF0aCwgdHNDb25maWcucHJvamVjdCl9XCJgKTtcbiAgfVxufVxuIl19