/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as i18n from '../../../i18n/i18n_ast';
import { toPublicName } from '../../../i18n/serializers/xmb';
import * as o from '../../../output/output_ast';
/* Closure variables holding messages must be named `MSG_[A-Z0-9]+` */
const CLOSURE_TRANSLATION_PREFIX = 'MSG_';
/* Prefix for non-`goog.getMsg` i18n-related vars */
export const TRANSLATION_PREFIX = 'I18N_';
/** Name of the i18n attributes **/
export const I18N_ATTR = 'i18n';
export const I18N_ATTR_PREFIX = 'i18n-';
/** Prefix of var expressions used in ICUs */
export const I18N_ICU_VAR_PREFIX = 'VAR_';
/** Prefix of ICU expressions for post processing */
export const I18N_ICU_MAPPING_PREFIX = 'I18N_EXP_';
/** Placeholder wrapper for i18n expressions **/
export const I18N_PLACEHOLDER_SYMBOL = '�';
export function isI18nAttribute(name) {
    return name === I18N_ATTR || name.startsWith(I18N_ATTR_PREFIX);
}
export function isI18nRootNode(meta) {
    return meta instanceof i18n.Message;
}
export function isSingleI18nIcu(meta) {
    return isI18nRootNode(meta) && meta.nodes.length === 1 && meta.nodes[0] instanceof i18n.Icu;
}
export function hasI18nMeta(node) {
    return !!node.i18n;
}
export function hasI18nAttrs(element) {
    return element.attrs.some((attr) => isI18nAttribute(attr.name));
}
export function icuFromI18nMessage(message) {
    return message.nodes[0];
}
export function wrapI18nPlaceholder(content, contextId = 0) {
    const blockId = contextId > 0 ? `:${contextId}` : '';
    return `${I18N_PLACEHOLDER_SYMBOL}${content}${blockId}${I18N_PLACEHOLDER_SYMBOL}`;
}
export function assembleI18nBoundString(strings, bindingStartIndex = 0, contextId = 0) {
    if (!strings.length)
        return '';
    let acc = '';
    const lastIdx = strings.length - 1;
    for (let i = 0; i < lastIdx; i++) {
        acc += `${strings[i]}${wrapI18nPlaceholder(bindingStartIndex + i, contextId)}`;
    }
    acc += strings[lastIdx];
    return acc;
}
export function getSeqNumberGenerator(startsAt = 0) {
    let current = startsAt;
    return () => current++;
}
export function placeholdersToParams(placeholders) {
    const params = {};
    placeholders.forEach((values, key) => {
        params[key] = o.literal(values.length > 1 ? `[${values.join('|')}]` : values[0]);
    });
    return params;
}
export function updatePlaceholderMap(map, name, ...values) {
    const current = map.get(name) || [];
    current.push(...values);
    map.set(name, current);
}
export function assembleBoundTextPlaceholders(meta, bindingStartIndex = 0, contextId = 0) {
    const startIdx = bindingStartIndex;
    const placeholders = new Map();
    const node = meta instanceof i18n.Message ? meta.nodes.find(node => node instanceof i18n.Container) : meta;
    if (node) {
        node
            .children
            .filter((child) => child instanceof i18n.Placeholder)
            .forEach((child, idx) => {
            const content = wrapI18nPlaceholder(startIdx + idx, contextId);
            updatePlaceholderMap(placeholders, child.name, content);
        });
    }
    return placeholders;
}
/**
 * Format the placeholder names in a map of placeholders to expressions.
 *
 * The placeholder names are converted from "internal" format (e.g. `START_TAG_DIV_1`) to "external"
 * format (e.g. `startTagDiv_1`).
 *
 * @param params A map of placeholder names to expressions.
 * @param useCamelCase whether to camelCase the placeholder name when formatting.
 * @returns A new map of formatted placeholder names to expressions.
 */
export function i18nFormatPlaceholderNames(params = {}, useCamelCase) {
    const _params = {};
    if (params && Object.keys(params).length) {
        Object.keys(params).forEach(key => _params[formatI18nPlaceholderName(key, useCamelCase)] = params[key]);
    }
    return _params;
}
/**
 * Converts internal placeholder names to public-facing format
 * (for example to use in goog.getMsg call).
 * Example: `START_TAG_DIV_1` is converted to `startTagDiv_1`.
 *
 * @param name The placeholder name that should be formatted
 * @returns Formatted placeholder name
 */
export function formatI18nPlaceholderName(name, useCamelCase = true) {
    const publicName = toPublicName(name);
    if (!useCamelCase) {
        return publicName;
    }
    const chunks = publicName.split('_');
    if (chunks.length === 1) {
        // if no "_" found - just lowercase the value
        return name.toLowerCase();
    }
    let postfix;
    // eject last element if it's a number
    if (/^\d+$/.test(chunks[chunks.length - 1])) {
        postfix = chunks.pop();
    }
    let raw = chunks.shift().toLowerCase();
    if (chunks.length) {
        raw += chunks.map(c => c.charAt(0).toUpperCase() + c.slice(1).toLowerCase()).join('');
    }
    return postfix ? `${raw}_${postfix}` : raw;
}
/**
 * Generates a prefix for translation const name.
 *
 * @param extra Additional local prefix that should be injected into translation var name
 * @returns Complete translation const prefix
 */
export function getTranslationConstPrefix(extra) {
    return `${CLOSURE_TRANSLATION_PREFIX}${extra}`.toUpperCase();
}
/**
 * Generate AST to declare a variable. E.g. `var I18N_1;`.
 * @param variable the name of the variable to declare.
 */
export function declareI18nVariable(variable) {
    return new o.DeclareVarStmt(variable.name, undefined, o.INFERRED_TYPE, null, variable.sourceSpan);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9yZW5kZXIzL3ZpZXcvaTE4bi91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUNILE9BQU8sS0FBSyxJQUFJLE1BQU0sd0JBQXdCLENBQUM7QUFDL0MsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLCtCQUErQixDQUFDO0FBRTNELE9BQU8sS0FBSyxDQUFDLE1BQU0sNEJBQTRCLENBQUM7QUFHaEQsc0VBQXNFO0FBQ3RFLE1BQU0sMEJBQTBCLEdBQUcsTUFBTSxDQUFDO0FBRTFDLG9EQUFvRDtBQUNwRCxNQUFNLENBQUMsTUFBTSxrQkFBa0IsR0FBRyxPQUFPLENBQUM7QUFFMUMsbUNBQW1DO0FBQ25DLE1BQU0sQ0FBQyxNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUM7QUFDaEMsTUFBTSxDQUFDLE1BQU0sZ0JBQWdCLEdBQUcsT0FBTyxDQUFDO0FBRXhDLDZDQUE2QztBQUM3QyxNQUFNLENBQUMsTUFBTSxtQkFBbUIsR0FBRyxNQUFNLENBQUM7QUFFMUMsb0RBQW9EO0FBQ3BELE1BQU0sQ0FBQyxNQUFNLHVCQUF1QixHQUFHLFdBQVcsQ0FBQztBQUVuRCxnREFBZ0Q7QUFDaEQsTUFBTSxDQUFDLE1BQU0sdUJBQXVCLEdBQUcsR0FBRyxDQUFDO0FBRTNDLE1BQU0sVUFBVSxlQUFlLENBQUMsSUFBWTtJQUMxQyxPQUFPLElBQUksS0FBSyxTQUFTLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ2pFLENBQUM7QUFFRCxNQUFNLFVBQVUsY0FBYyxDQUFDLElBQW9CO0lBQ2pELE9BQU8sSUFBSSxZQUFZLElBQUksQ0FBQyxPQUFPLENBQUM7QUFDdEMsQ0FBQztBQUVELE1BQU0sVUFBVSxlQUFlLENBQUMsSUFBb0I7SUFDbEQsT0FBTyxjQUFjLENB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QUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO0FBQzdDLENBQUM7QUFFRDs7Ozs7R0FLRztBQUNILE1BQU0sVUFBVSx5QkFBeUIsQ0FBQyxLQUFhO0lBQ3JELE9BQU8sR0FBRywwQkFBMEIsR0FBRyxLQUFLLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUMvRCxDQUFDO0FBRUQ7OztHQUdHO0FBQ0gsTUFBTSxVQUFVLG1CQUFtQixDQUFDLFFBQXVCO0lBQ3pELE9BQU8sSUFBSSxDQUFDLENBQUMsY0FBYyxDQUN2QixRQUFRLENBQUMsSUFBSyxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUMsYUFBYSxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDN0UsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0ICogYXMgaTE4biBmcm9tICcuLi8uLi8uLi9pMThuL2kxOG5fYXN0JztcbmltcG9ydCB7dG9QdWJsaWNOYW1lfSBmcm9tICcuLi8uLi8uLi9pMThuL3NlcmlhbGl6ZXJzL3htYic7XG5pbXBvcnQgKiBhcyBodG1sIGZyb20gJy4uLy4uLy4uL21sX3BhcnNlci9hc3QnO1xuaW1wb3J0ICogYXMgbyBmcm9tICcuLi8uLi8uLi9vdXRwdXQvb3V0cHV0X2FzdCc7XG5pbXBvcnQgKiBhcyB0IGZyb20gJy4uLy4uL3IzX2FzdCc7XG5cbi8qIENsb3N1cmUgdmFyaWFibGVzIGhvbGRpbmcgbWVzc2FnZXMgbXVzdCBiZSBuYW1lZCBgTVNHX1tBLVowLTldK2AgKi9cbmNvbnN0IENMT1NVUkVfVFJBTlNMQVRJT05fUFJFRklYID0gJ01TR18nO1xuXG4vKiBQcmVmaXggZm9yIG5vbi1gZ29vZy5nZXRNc2dgIGkxOG4tcmVsYXRlZCB2YXJzICovXG5leHBvcnQgY29uc3QgVFJBTlNMQVRJT05fUFJFRklYID0gJ0kxOE5fJztcblxuLyoqIE5hbWUgb2YgdGhlIGkxOG4gYXR0cmlidXRlcyAqKi9cbmV4cG9ydCBjb25zdCBJMThOX0FUVFIgPSAnaTE4bic7XG5leHBvcnQgY29uc3QgSTE4Tl9BVFRSX1BSRUZJWCA9ICdpMThuLSc7XG5cbi8qKiBQcmVmaXggb2YgdmFyIGV4cHJlc3Npb25zIHVzZWQgaW4gSUNVcyAqL1xuZXhwb3J0IGNvbnN0IEkxOE5fSUNVX1ZBUl9QUkVGSVggPSAnVkFSXyc7XG5cbi8qKiBQcmVmaXggb2YgSUNVIGV4cHJlc3Npb25zIGZvciBwb3N0IHByb2Nlc3NpbmcgKi9cbmV4cG9ydCBjb25zdCBJMThOX0lDVV9NQVBQSU5HX1BSRUZJWCA9ICdJMThOX0VYUF8nO1xuXG4vKiogUGxhY2Vob2xkZXIgd3JhcHBlciBmb3IgaTE4biBleHByZXNzaW9ucyAqKi9cbmV4cG9ydCBjb25zdCBJMThOX1BMQUNFSE9MREVSX1NZTUJPTCA9ICfvv70nO1xuXG5leHBvcnQgZnVuY3Rpb24gaXNJMThuQXR0cmlidXRlKG5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gbmFtZSA9PT0gSTE4Tl9BVFRSIHx8IG5hbWUuc3RhcnRzV2l0aChJMThOX0FUVFJfUFJFRklYKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzSTE4blJvb3ROb2RlKG1ldGE/OiBpMThuLkkxOG5NZXRhKTogbWV0YSBpcyBpMThuLk1lc3NhZ2Uge1xuICByZXR1cm4gbWV0YSBpbnN0YW5jZW9mIGkxOG4uTWVzc2FnZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzU2luZ2xlSTE4bkljdShtZXRhPzogaTE4bi5JMThuTWV0YSk6IGJvb2xlYW4ge1xuICByZXR1cm4gaXNJMThuUm9vdE5vZGUobWV0YSkgJiYgbWV0YS5ub2Rlcy5sZW5ndGggPT09IDEgJiYgbWV0YS5ub2Rlc1swXSBpbnN0YW5jZW9mIGkxOG4uSWN1O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaGFzSTE4bk1ldGEobm9kZTogdC5Ob2RlJntpMThuPzogaTE4bi5JMThuTWV0YX0pOiBib29sZWFuIHtcbiAgcmV0dXJuICEhbm9kZS5pMThuO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaGFzSTE4bkF0dHJzKGVsZW1lbnQ6IGh0bWwuRWxlbWVudCk6IGJvb2xlYW4ge1xuICByZXR1cm4gZWxlbWVudC5hdHRycy5zb21lKChhdHRyOiBodG1sLkF0dHJpYnV0ZSkgPT4gaXNJMThuQXR0cmlidXRlKGF0dHIubmFtZSkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaWN1RnJvbUkxOG5NZXNzYWdlKG1lc3NhZ2U6IGkxOG4uTWVzc2FnZSkge1xuICByZXR1cm4gbWVzc2FnZS5ub2Rlc1swXSBhcyBpMThuLkljdVBsYWNlaG9sZGVyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gd3JhcEkxOG5QbGFjZWhvbGRlcihjb250ZW50OiBzdHJpbmd8bnVtYmVyLCBjb250ZXh0SWQ6IG51bWJlciA9IDApOiBzdHJpbmcge1xuICBjb25zdCBibG9ja0lkID0gY29udGV4dElkID4gMCA/IGA6JHtjb250ZXh0SWR9YCA6ICcnO1xuICByZXR1cm4gYCR7STE4Tl9QTEFDRUhPTERFUl9TWU1CT0x9JHtjb250ZW50fSR7YmxvY2tJZH0ke0kxOE5fUExBQ0VIT0xERVJfU1lNQk9MfWA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhc3NlbWJsZUkxOG5Cb3VuZFN0cmluZyhcbiAgICBzdHJpbmdzOiBzdHJpbmdbXSwgYmluZGluZ1N0YXJ0SW5kZXg6IG51bWJlciA9IDAsIGNvbnRleHRJZDogbnVtYmVyID0gMCk6IHN0cmluZyB7XG4gIGlmICghc3RyaW5ncy5sZW5ndGgpIHJldHVybiAnJztcbiAgbGV0IGFjYyA9ICcnO1xuICBjb25zdCBsYXN0SWR4ID0gc3RyaW5ncy5sZW5ndGggLSAxO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGxhc3RJZHg7IGkrKykge1xuICAgIGFjYyArPSBgJHtzdHJpbmdzW2ldfSR7d3JhcEkxOG5QbGFjZWhvbGRlcihiaW5kaW5nU3RhcnRJbmRleCArIGksIGNvbnRleHRJZCl9YDtcbiAgfVxuICBhY2MgKz0gc3RyaW5nc1tsYXN0SWR4XTtcbiAgcmV0dXJuIGFjYztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFNlcU51bWJlckdlbmVyYXRvcihzdGFydHNBdDogbnVtYmVyID0gMCk6ICgpID0+IG51bWJlciB7XG4gIGxldCBjdXJyZW50ID0gc3RhcnRzQXQ7XG4gIHJldHVybiAoKSA9PiBjdXJyZW50Kys7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwbGFjZWhvbGRlcnNUb1BhcmFtcyhwbGFjZWhvbGRlcnM6IE1hcDxzdHJpbmcsIHN0cmluZ1tdPik6XG4gICAge1tuYW1lOiBzdHJpbmddOiBvLkxpdGVyYWxFeHByfSB7XG4gIGNvbnN0IHBhcmFtczoge1tuYW1lOiBzdHJpbmddOiBvLkxpdGVyYWxFeHByfSA9IHt9O1xuICBwbGFjZWhvbGRlcnMuZm9yRWFjaCgodmFsdWVzOiBzdHJpbmdbXSwga2V5OiBzdHJpbmcpID0+IHtcbiAgICBwYXJhbXNba2V5XSA9IG8ubGl0ZXJhbCh2YWx1ZXMubGVuZ3RoID4gMSA/IGBbJHt2YWx1ZXMuam9pbignfCcpfV1gIDogdmFsdWVzWzBdKTtcbiAgfSk7XG4gIHJldHVybiBwYXJhbXM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVQbGFjZWhvbGRlck1hcChtYXA6IE1hcDxzdHJpbmcsIGFueVtdPiwgbmFtZTogc3RyaW5nLCAuLi52YWx1ZXM6IGFueVtdKSB7XG4gIGNvbnN0IGN1cnJlbnQgPSBtYXAuZ2V0KG5hbWUpIHx8IFtdO1xuICBjdXJyZW50LnB1c2goLi4udmFsdWVzKTtcbiAgbWFwLnNldChuYW1lLCBjdXJyZW50KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VtYmxlQm91bmRUZXh0UGxhY2Vob2xkZXJzKFxuICAgIG1ldGE6IGkxOG4uSTE4bk1ldGEsIGJpbmRpbmdTdGFydEluZGV4OiBudW1iZXIgPSAwLCBjb250ZXh0SWQ6IG51bWJlciA9IDApOiBNYXA8c3RyaW5nLCBhbnlbXT4ge1xuICBjb25zdCBzdGFydElkeCA9IGJpbmRpbmdTdGFydEluZGV4O1xuICBjb25zdCBwbGFjZWhvbGRlcnMgPSBuZXcgTWFwPHN0cmluZywgYW55PigpO1xuICBjb25zdCBub2RlID1cbiAgICAgIG1ldGEgaW5zdGFuY2VvZiBpMThuLk1lc3NhZ2UgPyBtZXRhLm5vZGVzLmZpbmQobm9kZSA9PiBub2RlIGluc3RhbmNlb2YgaTE4bi5Db250YWluZXIpIDogbWV0YTtcbiAgaWYgKG5vZGUpIHtcbiAgICAobm9kZSBhcyBpMThuLkNvbnRhaW5lcilcbiAgICAgICAgLmNoaWxkcmVuXG4gICAgICAgIC5maWx0ZXIoKGNoaWxkOiBpMThuLk5vZGUpOiBjaGlsZCBpcyBpMThuLlBsYWNlaG9sZGVyID0+IGNoaWxkIGluc3RhbmNlb2YgaTE4bi5QbGFjZWhvbGRlcilcbiAgICAgICAgLmZvckVhY2goKGNoaWxkOiBpMThuLlBsYWNlaG9sZGVyLCBpZHg6IG51bWJlcikgPT4ge1xuICAgICAgICAgIGNvbnN0IGNvbnRlbnQgPSB3cmFwSTE4blBsYWNlaG9sZGVyKHN0YXJ0SWR4ICsgaWR4LCBjb250ZXh0SWQpO1xuICAgICAgICAgIHVwZGF0ZVBsYWNlaG9sZGVyTWFwKHBsYWNlaG9sZGVycywgY2hpbGQubmFtZSwgY29udGVudCk7XG4gICAgICAgIH0pO1xuICB9XG4gIHJldHVybiBwbGFjZWhvbGRlcnM7XG59XG5cbi8qKlxuICogRm9ybWF0IHRoZSBwbGFjZWhvbGRlciBuYW1lcyBpbiBhIG1hcCBvZiBwbGFjZWhvbGRlcnMgdG8gZXhwcmVzc2lvbnMuXG4gKlxuICogVGhlIHBsYWNlaG9sZGVyIG5hbWVzIGFyZSBjb252ZXJ0ZWQgZnJvbSBcImludGVybmFsXCIgZm9ybWF0IChlLmcuIGBTVEFSVF9UQUdfRElWXzFgKSB0byBcImV4dGVybmFsXCJcbiAqIGZvcm1hdCAoZS5nLiBgc3RhcnRUYWdEaXZfMWApLlxuICpcbiAqIEBwYXJhbSBwYXJhbXMgQSBtYXAgb2YgcGxhY2Vob2xkZXIgbmFtZXMgdG8gZXhwcmVzc2lvbnMuXG4gKiBAcGFyYW0gdXNlQ2FtZWxDYXNlIHdoZXRoZXIgdG8gY2FtZWxDYXNlIHRoZSBwbGFjZWhvbGRlciBuYW1lIHdoZW4gZm9ybWF0dGluZy5cbiAqIEByZXR1cm5zIEEgbmV3IG1hcCBvZiBmb3JtYXR0ZWQgcGxhY2Vob2xkZXIgbmFtZXMgdG8gZXhwcmVzc2lvbnMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpMThuRm9ybWF0UGxhY2Vob2xkZXJOYW1lcyhcbiAgICBwYXJhbXM6IHtbbmFtZTogc3RyaW5nXTogby5FeHByZXNzaW9ufSA9IHt9LCB1c2VDYW1lbENhc2U6IGJvb2xlYW4pIHtcbiAgY29uc3QgX3BhcmFtczoge1trZXk6IHN0cmluZ106IG8uRXhwcmVzc2lvbn0gPSB7fTtcbiAgaWYgKHBhcmFtcyAmJiBPYmplY3Qua2V5cyhwYXJhbXMpLmxlbmd0aCkge1xuICAgIE9iamVjdC5rZXlzKHBhcmFtcykuZm9yRWFjaChcbiAgICAgICAga2V5ID0+IF9wYXJhbXNbZm9ybWF0STE4blBsYWNlaG9sZGVyTmFtZShrZXksIHVzZUNhbWVsQ2FzZSldID0gcGFyYW1zW2tleV0pO1xuICB9XG4gIHJldHVybiBfcGFyYW1zO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGludGVybmFsIHBsYWNlaG9sZGVyIG5hbWVzIHRvIHB1YmxpYy1mYWNpbmcgZm9ybWF0XG4gKiAoZm9yIGV4YW1wbGUgdG8gdXNlIGluIGdvb2cuZ2V0TXNnIGNhbGwpLlxuICogRXhhbXBsZTogYFNUQVJUX1RBR19ESVZfMWAgaXMgY29udmVydGVkIHRvIGBzdGFydFRhZ0Rpdl8xYC5cbiAqXG4gKiBAcGFyYW0gbmFtZSBUaGUgcGxhY2Vob2xkZXIgbmFtZSB0aGF0IHNob3VsZCBiZSBmb3JtYXR0ZWRcbiAqIEByZXR1cm5zIEZvcm1hdHRlZCBwbGFjZWhvbGRlciBuYW1lXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXRJMThuUGxhY2Vob2xkZXJOYW1lKG5hbWU6IHN0cmluZywgdXNlQ2FtZWxDYXNlOiBib29sZWFuID0gdHJ1ZSk6IHN0cmluZyB7XG4gIGNvbnN0IHB1YmxpY05hbWUgPSB0b1B1YmxpY05hbWUobmFtZSk7XG4gIGlmICghdXNlQ2FtZWxDYXNlKSB7XG4gICAgcmV0dXJuIHB1YmxpY05hbWU7XG4gIH1cbiAgY29uc3QgY2h1bmtzID0gcHVibGljTmFtZS5zcGxpdCgnXycpO1xuICBpZiAoY2h1bmtzLmxlbmd0aCA9PT0gMSkge1xuICAgIC8vIGlmIG5vIFwiX1wiIGZvdW5kIC0ganVzdCBsb3dlcmNhc2UgdGhlIHZhbHVlXG4gICAgcmV0dXJuIG5hbWUudG9Mb3dlckNhc2UoKTtcbiAgfVxuICBsZXQgcG9zdGZpeDtcbiAgLy8gZWplY3QgbGFzdCBlbGVtZW50IGlmIGl0J3MgYSBudW1iZXJcbiAgaWYgKC9eXFxkKyQvLnRlc3QoY2h1bmtzW2NodW5rcy5sZW5ndGggLSAxXSkpIHtcbiAgICBwb3N0Zml4ID0gY2h1bmtzLnBvcCgpO1xuICB9XG4gIGxldCByYXcgPSBjaHVua3Muc2hpZnQoKSEudG9Mb3dlckNhc2UoKTtcbiAgaWYgKGNodW5rcy5sZW5ndGgpIHtcbiAgICByYXcgKz0gY2h1bmtzLm1hcChjID0+IGMuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBjLnNsaWNlKDEpLnRvTG93ZXJDYXNlKCkpLmpvaW4oJycpO1xuICB9XG4gIHJldHVybiBwb3N0Zml4ID8gYCR7cmF3fV8ke3Bvc3RmaXh9YCA6IHJhdztcbn1cblxuLyoqXG4gKiBHZW5lcmF0ZXMgYSBwcmVmaXggZm9yIHRyYW5zbGF0aW9uIGNvbnN0IG5hbWUuXG4gKlxuICogQHBhcmFtIGV4dHJhIEFkZGl0aW9uYWwgbG9jYWwgcHJlZml4IHRoYXQgc2hvdWxkIGJlIGluamVjdGVkIGludG8gdHJhbnNsYXRpb24gdmFyIG5hbWVcbiAqIEByZXR1cm5zIENvbXBsZXRlIHRyYW5zbGF0aW9uIGNvbnN0IHByZWZpeFxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0VHJhbnNsYXRpb25Db25zdFByZWZpeChleHRyYTogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIGAke0NMT1NVUkVfVFJBTlNMQVRJT05fUFJFRklYfSR7ZXh0cmF9YC50b1VwcGVyQ2FzZSgpO1xufVxuXG4vKipcbiAqIEdlbmVyYXRlIEFTVCB0byBkZWNsYXJlIGEgdmFyaWFibGUuIEUuZy4gYHZhciBJMThOXzE7YC5cbiAqIEBwYXJhbSB2YXJpYWJsZSB0aGUgbmFtZSBvZiB0aGUgdmFyaWFibGUgdG8gZGVjbGFyZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlY2xhcmVJMThuVmFyaWFibGUodmFyaWFibGU6IG8uUmVhZFZhckV4cHIpOiBvLlN0YXRlbWVudCB7XG4gIHJldHVybiBuZXcgby5EZWNsYXJlVmFyU3RtdChcbiAgICAgIHZhcmlhYmxlLm5hbWUhLCB1bmRlZmluZWQsIG8uSU5GRVJSRURfVFlQRSwgbnVsbCwgdmFyaWFibGUuc291cmNlU3Bhbik7XG59XG4iXX0=