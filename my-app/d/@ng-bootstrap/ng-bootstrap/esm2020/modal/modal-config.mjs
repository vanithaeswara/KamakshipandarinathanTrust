import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../ngb-config";
/**
 * A configuration service for the [`NgbModal`](#/components/modal/api#NgbModal) service.
 *
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all modals used in the application.
*
* @since 3.1.0
*/
export class NgbModalConfig {
    constructor(_ngbConfig) {
        this._ngbConfig = _ngbConfig;
        this.backdrop = true;
        this.fullscreen = false;
        this.keyboard = true;
    }
    get animation() { return (this._animation === undefined) ? this._ngbConfig.animation : this._animation; }
    set animation(animation) { this._animation = animation; }
}
NgbModalConfig.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbModalConfig, deps: [{ token: i1.NgbConfig }], target: i0.ɵɵFactoryTarget.Injectable });
NgbModalConfig.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbModalConfig, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbModalConfig, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i1.NgbConfig }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kYWwtY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL21vZGFsL21vZGFsLWNvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsVUFBVSxFQUFXLE1BQU0sZUFBZSxDQUFDOzs7QUEySG5EOzs7Ozs7O0VBT0U7QUFFRixNQUFNLE9BQU8sY0FBYztJQWtCekIsWUFBb0IsVUFBcUI7UUFBckIsZUFBVSxHQUFWLFVBQVUsQ0FBVztRQWZ6QyxhQUFRLEdBQXVCLElBQUksQ0FBQztRQUlwQyxlQUFVLEdBQXlELEtBQUssQ0FBQztRQUV6RSxhQUFRLEdBQUcsSUFBSSxDQUFDO0lBUzRCLENBQUM7SUFFN0MsSUFBSSxTQUFTLEtBQWMsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztJQUNsSCxJQUFJLFNBQVMsQ0FBQyxTQUFrQixJQUFJLElBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQzs7MkdBckJ2RCxjQUFjOytHQUFkLGNBQWMsY0FERixNQUFNOzJGQUNsQixjQUFjO2tCQUQxQixVQUFVO21CQUFDLEVBQUMsVUFBVSxFQUFFLE1BQU0sRUFBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SW5qZWN0YWJsZSwgSW5qZWN0b3J9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtOZ2JDb25maWd9IGZyb20gJy4uL25nYi1jb25maWcnO1xuXG4vKipcbiAqIE9wdGlvbnMgYXZhaWxhYmxlIHdoZW4gb3BlbmluZyBuZXcgbW9kYWwgd2luZG93cyB3aXRoIGBOZ2JNb2RhbC5vcGVuKClgIG1ldGhvZC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBOZ2JNb2RhbE9wdGlvbnMge1xuICAvKipcbiAgICogSWYgYHRydWVgLCBtb2RhbCBvcGVuaW5nIGFuZCBjbG9zaW5nIHdpbGwgYmUgYW5pbWF0ZWQuXG4gICAqXG4gICAqIEBzaW5jZSA4LjAuMFxuICAgKi9cbiAgYW5pbWF0aW9uPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogYGFyaWEtbGFiZWxsZWRieWAgYXR0cmlidXRlIHZhbHVlIHRvIHNldCBvbiB0aGUgbW9kYWwgd2luZG93LlxuICAgKlxuICAgKiBAc2luY2UgMi4yLjBcbiAgICovXG4gIGFyaWFMYWJlbGxlZEJ5Pzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBgYXJpYS1kZXNjcmliZWRieWAgYXR0cmlidXRlIHZhbHVlIHRvIHNldCBvbiB0aGUgbW9kYWwgd2luZG93LlxuICAgKlxuICAgKiBAc2luY2UgNi4xLjBcbiAgICovXG4gIGFyaWFEZXNjcmliZWRCeT86IHN0cmluZztcblxuICAvKipcbiAgICogSWYgYHRydWVgLCB0aGUgYmFja2Ryb3AgZWxlbWVudCB3aWxsIGJlIGNyZWF0ZWQgZm9yIGEgZ2l2ZW4gbW9kYWwuXG4gICAqXG4gICAqIEFsdGVybmF0aXZlbHksIHNwZWNpZnkgYCdzdGF0aWMnYCBmb3IgYSBiYWNrZHJvcCB3aGljaCBkb2Vzbid0IGNsb3NlIHRoZSBtb2RhbCBvbiBjbGljay5cbiAgICpcbiAgICogRGVmYXVsdCB2YWx1ZSBpcyBgdHJ1ZWAuXG4gICAqL1xuICBiYWNrZHJvcD86IGJvb2xlYW4gfCAnc3RhdGljJztcblxuICAvKipcbiAgICogQ2FsbGJhY2sgcmlnaHQgYmVmb3JlIHRoZSBtb2RhbCB3aWxsIGJlIGRpc21pc3NlZC5cbiAgICpcbiAgICogSWYgdGhpcyBmdW5jdGlvbiByZXR1cm5zOlxuICAgKiAqIGBmYWxzZWBcbiAgICogKiBhIHByb21pc2UgcmVzb2x2ZWQgd2l0aCBgZmFsc2VgXG4gICAqICogYSBwcm9taXNlIHRoYXQgaXMgcmVqZWN0ZWRcbiAgICpcbiAgICogdGhlbiB0aGUgbW9kYWwgd29uJ3QgYmUgZGlzbWlzc2VkLlxuICAgKi9cbiAgYmVmb3JlRGlzbWlzcz86ICgpID0+IGJvb2xlYW4gfCBQcm9taXNlPGJvb2xlYW4+O1xuXG4gIC8qKlxuICAgKiBJZiBgdHJ1ZWAsIHRoZSBtb2RhbCB3aWxsIGJlIGNlbnRlcmVkIHZlcnRpY2FsbHkuXG4gICAqXG4gICAqIERlZmF1bHQgdmFsdWUgaXMgYGZhbHNlYC5cbiAgICpcbiAgICogQHNpbmNlIDEuMS4wXG4gICAqL1xuICBjZW50ZXJlZD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEEgc2VsZWN0b3Igc3BlY2lmeWluZyB0aGUgZWxlbWVudCBhbGwgbmV3IG1vZGFsIHdpbmRvd3Mgc2hvdWxkIGJlIGFwcGVuZGVkIHRvLlxuICAgKiBTaW5jZSB2NS4zLjAgaXQgaXMgYWxzbyBwb3NzaWJsZSB0byBwYXNzIHRoZSByZWZlcmVuY2UgdG8gYW4gYEhUTUxFbGVtZW50YC5cbiAgICpcbiAgICogSWYgbm90IHNwZWNpZmllZCwgd2lsbCBiZSBgYm9keWAuXG4gICAqL1xuICBjb250YWluZXI/OiBzdHJpbmcgfCBIVE1MRWxlbWVudDtcblxuICAvKipcbiAgICogSWYgYHRydWVgIG1vZGFsIHdpbGwgYWx3YXlzIGJlIGRpc3BsYXllZCBpbiBmdWxsc2NyZWVuIG1vZGUuXG4gICAqXG4gICAqIEZvciB2YWx1ZXMgbGlrZSBgJ21kJ2AgaXQgbWVhbnMgdGhhdCBtb2RhbCB3aWxsIGJlIGRpc3BsYXllZCBpbiBmdWxsc2NyZWVuIG1vZGVcbiAgICogb25seSBpZiB0aGUgdmlld3BvcnQgd2lkdGggaXMgYmVsb3cgYCdtZCdgLiBGb3IgY3VzdG9tIHN0cmluZ3MgKGV4LiB3aGVuIHBhc3NpbmcgYCdteXNpemUnYClcbiAgICogaXQgd2lsbCBhZGQgYSBgJ21vZGFsLWZ1bGxzY3JlZW4tbXlzaXplLWRvd24nYCBjbGFzcy5cbiAgICpcbiAgICogSWYgbm90IHNwZWNpZmllZCB3aWxsIGJlIGBmYWxzZWAuXG4gICAqXG4gICAqIEBzaW5jZSAxMi4xLjBcbiAgICovXG4gIGZ1bGxzY3JlZW4/OiAnc20nIHwgJ21kJyB8ICdsZycgfCAneGwnIHwgJ3h4bCcgfCBib29sZWFuIHwgc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgYEluamVjdG9yYCB0byB1c2UgZm9yIG1vZGFsIGNvbnRlbnQuXG4gICAqL1xuICBpbmplY3Rvcj86IEluamVjdG9yO1xuXG4gIC8qKlxuICAgKiBJZiBgdHJ1ZWAsIHRoZSBtb2RhbCB3aWxsIGJlIGNsb3NlZCB3aGVuIGBFc2NhcGVgIGtleSBpcyBwcmVzc2VkXG4gICAqXG4gICAqIERlZmF1bHQgdmFsdWUgaXMgYHRydWVgLlxuICAgKi9cbiAga2V5Ym9hcmQ/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBTY3JvbGxhYmxlIG1vZGFsIGNvbnRlbnQgKGZhbHNlIGJ5IGRlZmF1bHQpLlxuICAgKlxuICAgKiBAc2luY2UgNS4wLjBcbiAgICovXG4gIHNjcm9sbGFibGU/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBTaXplIG9mIGEgbmV3IG1vZGFsIHdpbmRvdy5cbiAgICovXG4gIHNpemU/OiAnc20nIHwgJ2xnJyB8ICd4bCcgfCBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEEgY3VzdG9tIGNsYXNzIHRvIGFwcGVuZCB0byB0aGUgbW9kYWwgd2luZG93LlxuICAgKi9cbiAgd2luZG93Q2xhc3M/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEEgY3VzdG9tIGNsYXNzIHRvIGFwcGVuZCB0byB0aGUgbW9kYWwgZGlhbG9nLlxuICAgKlxuICAgKiBAc2luY2UgOS4xLjBcbiAgICovXG4gIG1vZGFsRGlhbG9nQ2xhc3M/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEEgY3VzdG9tIGNsYXNzIHRvIGFwcGVuZCB0byB0aGUgbW9kYWwgYmFja2Ryb3AuXG4gICAqXG4gICAqIEBzaW5jZSAxLjEuMFxuICAgKi9cbiAgYmFja2Ryb3BDbGFzcz86IHN0cmluZztcbn1cblxuLyoqXG4gKiBBIGNvbmZpZ3VyYXRpb24gc2VydmljZSBmb3IgdGhlIFtgTmdiTW9kYWxgXSgjL2NvbXBvbmVudHMvbW9kYWwvYXBpI05nYk1vZGFsKSBzZXJ2aWNlLlxuICpcbiAqIFlvdSBjYW4gaW5qZWN0IHRoaXMgc2VydmljZSwgdHlwaWNhbGx5IGluIHlvdXIgcm9vdCBjb21wb25lbnQsIGFuZCBjdXN0b21pemUgdGhlIHZhbHVlcyBvZiBpdHMgcHJvcGVydGllcyBpblxuICogb3JkZXIgdG8gcHJvdmlkZSBkZWZhdWx0IHZhbHVlcyBmb3IgYWxsIG1vZGFscyB1c2VkIGluIHRoZSBhcHBsaWNhdGlvbi5cbipcbiogQHNpbmNlIDMuMS4wXG4qL1xuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgTmdiTW9kYWxDb25maWcgaW1wbGVtZW50cyBSZXF1aXJlZDxOZ2JNb2RhbE9wdGlvbnM+IHtcbiAgYXJpYUxhYmVsbGVkQnk6IHN0cmluZztcbiAgYXJpYURlc2NyaWJlZEJ5OiBzdHJpbmc7XG4gIGJhY2tkcm9wOiBib29sZWFuIHwgJ3N0YXRpYycgPSB0cnVlO1xuICBiZWZvcmVEaXNtaXNzOiAoKSA9PiBib29sZWFuIHwgUHJvbWlzZTxib29sZWFuPjtcbiAgY2VudGVyZWQ6IGJvb2xlYW47XG4gIGNvbnRhaW5lcjogc3RyaW5nIHwgSFRNTEVsZW1lbnQ7XG4gIGZ1bGxzY3JlZW46ICdzbScgfCAnbWQnIHwgJ2xnJyB8ICd4bCcgfCAneHhsJyB8IGJvb2xlYW4gfCBzdHJpbmcgPSBmYWxzZTtcbiAgaW5qZWN0b3I6IEluamVjdG9yO1xuICBrZXlib2FyZCA9IHRydWU7XG4gIHNjcm9sbGFibGU6IGJvb2xlYW47XG4gIHNpemU6ICdzbScgfCAnbGcnIHwgJ3hsJyB8IHN0cmluZztcbiAgd2luZG93Q2xhc3M6IHN0cmluZztcbiAgbW9kYWxEaWFsb2dDbGFzczogc3RyaW5nO1xuICBiYWNrZHJvcENsYXNzOiBzdHJpbmc7XG5cbiAgcHJpdmF0ZSBfYW5pbWF0aW9uOiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX25nYkNvbmZpZzogTmdiQ29uZmlnKSB7fVxuXG4gIGdldCBhbmltYXRpb24oKTogYm9vbGVhbiB7IHJldHVybiAodGhpcy5fYW5pbWF0aW9uID09PSB1bmRlZmluZWQpID8gdGhpcy5fbmdiQ29uZmlnLmFuaW1hdGlvbiA6IHRoaXMuX2FuaW1hdGlvbjsgfVxuICBzZXQgYW5pbWF0aW9uKGFuaW1hdGlvbjogYm9vbGVhbikgeyB0aGlzLl9hbmltYXRpb24gPSBhbmltYXRpb247IH1cbn1cbiJdfQ==