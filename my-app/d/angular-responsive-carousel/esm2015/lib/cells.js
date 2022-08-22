export class ImageUtils {
    constructor(element) {
        this.cellStack = [];
        this.element = element;
    }
    getImages() {
        return this.cellStack.filter(this.filter);
    }
    filter(cell) {
        return cell.img !== undefined;
    }
}
export class Cells {
    constructor(carouselProperties, utils) {
        this.carouselProperties = carouselProperties;
        this.utils = utils;
        this.counter = 0;
        this.imageUtils = new ImageUtils(this.element);
        this.init(carouselProperties);
    }
    get images() {
        return this.carouselProperties.images;
    }
    get cellLength() {
        return this.cells ? this.cells.length : 0;
    }
    get fullCellWidth() {
        return this.carouselProperties.cellWidth + this.carouselProperties.margin;
    }
    get cellLengthInLightDOMMode() {
        if (this.images) {
            let cellLength = this.numberOfVisibleCells + this.overflowCellsLimit * 2;
            if (cellLength > this.images.length) {
                cellLength = this.images.length;
            }
            return cellLength;
        }
        else {
            return this.cellLength;
        }
    }
    get numberOfVisibleCells() {
        return this.utils.numberOfVisibleCells;
    }
    get overflowCellsLimit() {
        return this.utils.overflowCellsLimit;
    }
    get isLightDOM() {
        return this.carouselProperties.lightDOM || this.carouselProperties.loop;
    }
    updateProperties(carouselProperties) {
        this.carouselProperties = carouselProperties;
    }
    lineUp() {
        const cells = this.element ? this.element.children : [];
        this.imageUtils.cellStack = [];
        for (var i = 0; i < cells.length; i++) {
            let cell = cells[i];
            let positionX = this.getCellPositionInContainer(i);
            cell.style.transform = 'translateX(' + positionX + 'px)';
            cell.style.width = this.carouselProperties.cellWidth + 'px';
            if (this.getImage(i)) {
                this.imageUtils.cellStack.push({
                    index: i,
                    positionX,
                    img: this.getImage(i)['image']
                });
            }
        }
        ;
    }
    ifSequenceOfCellsIsChanged() {
        const cells = this.element.children;
        return cells[0]['style'].transform !== 'translateX(0px)';
    }
    getCellPositionInContainer(cellIndexInDOMTree) {
        let positionIndex = this.getCellIndexInContainer(cellIndexInDOMTree);
        return positionIndex * this.fullCellWidth;
    }
    getCellIndexInContainer(cellIndexInDOMTree) {
        let positionIndex;
        if (!this.isLightDOM) {
            return cellIndexInDOMTree;
        }
        let cellLength = this.cellLengthInLightDOMMode;
        let counter = this.counter - this.overflowCellsLimit;
        if (counter > cellLength) {
            counter = counter % cellLength;
        }
        if (counter < 0) {
            return cellIndexInDOMTree;
        }
        else {
            positionIndex = cellIndexInDOMTree - counter;
            if (positionIndex < 0) {
                positionIndex = cellLength + positionIndex;
            }
        }
        return positionIndex;
    }
    getImage(cellIndex) {
        if (!this.images) {
            return;
        }
        let imageIndex = this.getImageIndex(cellIndex);
        let file = this.images[imageIndex];
        if (file && !file.type) {
            file.type = 'image';
        }
        return {
            image: this.images[imageIndex],
            imageIndex
        };
    }
    getImageIndex(cellIndexInDOMTree) {
        const positionIndex = this.getCellIndexInContainer(cellIndexInDOMTree);
        let imageIndex;
        if (this.counter > this.overflowCellsLimit) {
            let cellLimitOverflow = this.counter - this.overflowCellsLimit;
            imageIndex = positionIndex + cellLimitOverflow;
            if (this.images && this.carouselProperties.loop) {
                imageIndex = imageIndex % this.images.length;
            }
        }
        else {
            imageIndex = cellIndexInDOMTree;
        }
        return imageIndex;
    }
    setCounter(value) {
        this.counter = value;
    }
    init(carouselProperties) {
        this.element = this.carouselProperties.cellsElement;
        this.cells = this.element.children;
        this.visibleWidth = this.carouselProperties.visibleWidth || this.element.parentElement.clientWidth;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VsbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLXJlc3BvbnNpdmUtY2Fyb3VzZWwvc3JjL2xpYi9jZWxscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFXQSxNQUFNLE9BQU8sVUFBVTtJQUluQixZQUFZLE9BQWdDO1FBSDVDLGNBQVMsR0FBVyxFQUFFLENBQUM7UUFJbkIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7SUFDM0IsQ0FBQztJQUVELFNBQVM7UUFDTCxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBRUQsTUFBTSxDQUFDLElBQVU7UUFDYixPQUFPLElBQUksQ0FBQyxHQUFHLEtBQUssU0FBUyxDQUFDO0lBQ2xDLENBQUM7Q0FDSjtBQUVELE1BQU0sT0FBTyxLQUFLO0lBNENkLFlBQ1ksa0JBQXNDLEVBQ3RDLEtBQVU7UUFEVix1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW9CO1FBQ3RDLFVBQUssR0FBTCxLQUFLLENBQUs7UUExQ3RCLFlBQU8sR0FBVyxDQUFDLENBQUM7UUE0Q2hCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQy9DLElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBM0NELElBQUksTUFBTTtRQUNOLE9BQU8sSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQztJQUMxQyxDQUFDO0lBRUQsSUFBSSxVQUFVO1FBQ1YsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFFRCxJQUFJLGFBQWE7UUFDYixPQUFPLElBQUksQ0FBQyxrQkFB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LElBQUksaUJBQWlCLEdBQUcsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUM7WUFDL0QsVUFBVSxHQUFHLGFBQWEsR0FBRyxpQkFBaUIsQ0FBQztZQUUvQyxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksRUFBRTtnQkFDN0MsVUFBVSxHQUFHLFVBQVUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQzthQUNoRDtTQUNKO2FBQU07WUFDSCxVQUFVLEdBQUcsa0JBQWtCLENBQUM7U0FDbkM7UUFFRCxPQUFPLFVBQVUsQ0FBQztJQUN0QixDQUFDO0lBRUQsVUFBVSxDQUFDLEtBQWE7UUFDcEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7SUFDekIsQ0FBQztJQUVELElBQUksQ0FBQyxrQkFBc0M7UUFDdkMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsWUFBWSxDQUFDO1FBQ3BELElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUM7UUFDbkMsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsWUFBWSxJQUFJLElBQUksQ0FBQyxPQUFRLENBQUMsYUFBYyxDQUFDLFdBQVcsQ0FBQztJQUN6RyxDQUFDO0NBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1Byb3BlcnRpZXMgYXMgQ2Fyb3VzZWxQcm9wZXJ0aWVzLCBJbWFnZX0gZnJvbSAnLi9pbnRlcmZhY2VzJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQ2VsbCB7XHJcbiAgICBpbmRleDogbnVtYmVyLFxyXG4gICAgcG9zaXRpb25YOiBudW1iZXIsXHJcbiAgICBpbWc6IHtcclxuICAgICAgICBpbWFnZTogSW1hZ2UsXHJcbiAgICAgICAgaW1hZ2VJbmRleDogbnVtYmVyXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBJbWFnZVV0aWxzIHtcclxuICAgIGNlbGxTdGFjazogQ2VsbFtdID0gW107XHJcbiAgICBlbGVtZW50OmFueTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50OiBIVE1MRWxlbWVudCB8IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0SW1hZ2VzKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNlbGxTdGFjay5maWx0ZXIodGhpcy5maWx0ZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIGZpbHRlcihjZWxsOiBDZWxsKSB7XHJcbiAgICAgICAgcmV0dXJuIGNlbGwuaW1nICE9PSB1bmRlZmluZWQ7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBDZWxscyB7XHJcbiAgICBjZWxsczogSFRNTENvbGxlY3Rpb24gfCB1bmRlZmluZWQ7XHJcbiAgICBlbGVtZW50ITogSFRNTEVsZW1lbnQ7XHJcbiAgICB2aXNpYmxlV2lkdGg6IG51bWJlciB8IHVuZGVmaW5lZDtcclxuICAgIGNvdW50ZXI6IG51bWJlciA9IDA7XHJcbiAgICBpbWFnZVV0aWxzO1xyXG5cclxuICAgIGdldCBpbWFnZXMoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2Fyb3VzZWxQcm9wZXJ0aWVzLmltYWdlcztcclxuICAgIH1cclxuXHJcbiAgICBnZXQgY2VsbExlbmd0aCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jZWxscyA/IHRoaXMuY2VsbHMubGVuZ3RoIDogMDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgZnVsbENlbGxXaWR0aCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jYXJvdXNlbFByb3BlcnRpZXMuY2VsbFdpZHRoICsgdGhpcy5jYXJvdXNlbFByb3BlcnRpZXMubWFyZ2luO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBjZWxsTGVuZ3RoSW5MaWdodERPTU1vZGUoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaW1hZ2VzKSB7XHJcbiAgICAgICAgICAgIGxldCBjZWxsTGVuZ3RoID0gdGhpcy5udW1iZXJPZlZpc2libGVDZWxscyArIHRoaXMub3ZlcmZsb3dDZWxsc0xpbWl0ICogMjtcclxuXHJcbiAgICAgICAgICAgIGlmIChjZWxsTGVuZ3RoID4gdGhpcy5pbWFnZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBjZWxsTGVuZ3RoID0gdGhpcy5pbWFnZXMubGVuZ3RoO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBjZWxsTGVuZ3RoO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNlbGxMZW5ndGg7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldCBudW1iZXJPZlZpc2libGVDZWxscygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy51dGlscy5udW1iZXJPZlZpc2libGVDZWxscztcclxuICAgIH1cclxuXHJcbiAgICBnZXQgb3ZlcmZsb3dDZWxsc0xpbWl0KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnV0aWxzLm92ZXJmbG93Q2VsbHNMaW1pdDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgaXNMaWdodERPTSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jYXJvdXNlbFByb3BlcnRpZXMubGlnaHRET00gfHwgdGhpcy5jYXJvdXNlbFByb3BlcnRpZXMubG9vcDtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBwcml2YXRlIGNhcm91c2VsUHJvcGVydGllczogQ2Fyb3VzZWxQcm9wZXJ0aWVzLFxyXG4gICAgICAgIHByaXZhdGUgdXRpbHM6IGFueSkge1xyXG5cclxuICAgICAgICB0aGlzLmltYWdlVXRpbHMgPSBuZXcgSW1hZ2VVdGlscyh0aGlzLmVsZW1lbnQpO1xyXG4gICAgICAgIHRoaXMuaW5pdChjYXJvdXNlbFByb3BlcnRpZXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVByb3BlcnRpZXMoY2Fyb3VzZWxQcm9wZXJ0aWVzOiBDYXJvdXNlbFByb3BlcnRpZXMpIHtcclxuICAgICAgICB0aGlzLmNhcm91c2VsUHJvcGVydGllcyA9IGNhcm91c2VsUHJvcGVydGllcztcclxuICAgIH1cclxuXHJcbiAgICBsaW5lVXAoKSB7XHJcbiAgICAgICAgY29uc3QgY2VsbHMgPSB0aGlzLmVsZW1lbnQgPyB0aGlzLmVsZW1lbnQuY2hpbGRyZW4gOiBbXTtcclxuICAgICAgICB0aGlzLmltYWdlVXRpbHMuY2VsbFN0YWNrID0gW107XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2VsbHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IGNlbGwgPSBjZWxsc1tpXTtcclxuICAgICAgICAgICAgbGV0IHBvc2l0aW9uWCA9IHRoaXMuZ2V0Q2VsbFBvc2l0aW9uSW5Db250YWluZXIoaSk7XHJcbiAgICAgICAgICAgIChjZWxsIGFzIEhUTUxFbGVtZW50KS5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlWCgnICsgcG9zaXRpb25YICsgJ3B4KSc7XHJcbiAgICAgICAgICAgIChjZWxsIGFzIEhUTUxFbGVtZW50KS5zdHlsZS53aWR0aCA9IHRoaXMuY2Fyb3VzZWxQcm9wZXJ0aWVzLmNlbGxXaWR0aCArICdweCc7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5nZXRJbWFnZShpKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbWFnZVV0aWxzLmNlbGxTdGFjay5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICBpbmRleDogaSxcclxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvblgsXHJcbiAgICAgICAgICAgICAgICAgICAgaW1nOiB0aGlzLmdldEltYWdlKGkpIVsnaW1hZ2UnXVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGlmU2VxdWVuY2VPZkNlbGxzSXNDaGFuZ2VkKCkge1xyXG4gICAgICAgIGNvbnN0IGNlbGxzOmFueSA9IHRoaXMuZWxlbWVudC5jaGlsZHJlbjtcclxuICAgICAgICByZXR1cm4gY2VsbHNbMF1bJ3N0eWxlJ10udHJhbnNmb3JtICE9PSAndHJhbnNsYXRlWCgwcHgpJztcclxuICAgIH1cclxuXHJcbiAgICBnZXRDZWxsUG9zaXRpb25JbkNvbnRhaW5lcihjZWxsSW5kZXhJbkRPTVRyZWU6IG51bWJlcikge1xyXG4gICAgICAgIGxldCBwb3NpdGlvbkluZGV4ID0gdGhpcy5nZXRDZWxsSW5kZXhJbkNvbnRhaW5lcihjZWxsSW5kZXhJbkRPTVRyZWUpO1xyXG4gICAgICAgIHJldHVybiBwb3NpdGlvbkluZGV4ICogdGhpcy5mdWxsQ2VsbFdpZHRoO1xyXG4gICAgfVxyXG5cclxuICAgIGdldENlbGxJbmRleEluQ29udGFpbmVyKGNlbGxJbmRleEluRE9NVHJlZTogbnVtYmVyKSB7XHJcbiAgICAgICAgbGV0IHBvc2l0aW9uSW5kZXg7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5pc0xpZ2h0RE9NKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBjZWxsSW5kZXhJbkRPTVRyZWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgY2VsbExlbmd0aCA9IHRoaXMuY2VsbExlbmd0aEluTGlnaHRET01Nb2RlO1xyXG4gICAgICAgIGxldCBjb3VudGVyID0gdGhpcy5jb3VudGVyIC0gdGhpcy5vdmVyZmxvd0NlbGxzTGltaXQ7XHJcblxyXG4gICAgICAgIGlmIChjb3VudGVyID4gY2VsbExlbmd0aCkge1xyXG4gICAgICAgICAgICBjb3VudGVyID0gY291bnRlciAlIGNlbGxMZW5ndGg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoY291bnRlciA8IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIGNlbGxJbmRleEluRE9NVHJlZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBwb3NpdGlvbkluZGV4ID0gY2VsbEluZGV4SW5ET01UcmVlIC0gY291bnRlcjtcclxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uSW5kZXggPCAwKSB7XHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbkluZGV4ID0gY2VsbExlbmd0aCArIHBvc2l0aW9uSW5kZXg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBwb3NpdGlvbkluZGV4O1xyXG4gICAgfVxyXG5cclxuICAgIGdldEltYWdlKGNlbGxJbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmltYWdlcykge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgaW1hZ2VJbmRleCA9IHRoaXMuZ2V0SW1hZ2VJbmRleChjZWxsSW5kZXgpO1xyXG4gICAgICAgIGxldCBmaWxlID0gdGhpcy5pbWFnZXNbaW1hZ2VJbmRleF07XHJcblxyXG4gICAgICAgIGlmIChmaWxlICYmICFmaWxlLnR5cGUpIHtcclxuICAgICAgICAgICAgZmlsZS50eXBlID0gJ2ltYWdlJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGltYWdlOiB0aGlzLmltYWdlc1tpbWFnZUluZGV4XSxcclxuICAgICAgICAgICAgaW1hZ2VJbmRleFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0SW1hZ2VJbmRleChjZWxsSW5kZXhJbkRPTVRyZWU6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IHBvc2l0aW9uSW5kZXggPSB0aGlzLmdldENlbGxJbmRleEluQ29udGFpbmVyKGNlbGxJbmRleEluRE9NVHJlZSk7XHJcbiAgICAgICAgbGV0IGltYWdlSW5kZXg7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmNvdW50ZXIgPiB0aGlzLm92ZXJmbG93Q2VsbHNMaW1pdCkge1xyXG4gICAgICAgICAgICBsZXQgY2VsbExpbWl0T3ZlcmZsb3cgPSB0aGlzLmNvdW50ZXIgLSB0aGlzLm92ZXJmbG93Q2VsbHNMaW1pdDtcclxuICAgICAgICAgICAgaW1hZ2VJbmRleCA9IHBvc2l0aW9uSW5kZXggKyBjZWxsTGltaXRPdmVyZmxvdztcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmltYWdlcyAmJiB0aGlzLmNhcm91c2VsUHJvcGVydGllcy5sb29wKSB7XHJcbiAgICAgICAgICAgICAgICBpbWFnZUluZGV4ID0gaW1hZ2VJbmRleCAlIHRoaXMuaW1hZ2VzLmxlbmd0aDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGltYWdlSW5kZXggPSBjZWxsSW5kZXhJbkRPTVRyZWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gaW1hZ2VJbmRleDtcclxuICAgIH1cclxuXHJcbiAgICBzZXRDb3VudGVyKHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmNvdW50ZXIgPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0KGNhcm91c2VsUHJvcGVydGllczogQ2Fyb3VzZWxQcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gdGhpcy5jYXJvdXNlbFByb3BlcnRpZXMuY2VsbHNFbGVtZW50O1xyXG4gICAgICAgIHRoaXMuY2VsbHMgPSB0aGlzLmVsZW1lbnQuY2hpbGRyZW47XHJcbiAgICAgICAgdGhpcy52aXNpYmxlV2lkdGggPSB0aGlzLmNhcm91c2VsUHJvcGVydGllcy52aXNpYmxlV2lkdGggfHwgdGhpcy5lbGVtZW50IS5wYXJlbnRFbGVtZW50IS5jbGllbnRXaWR0aDtcclxuICAgIH1cclxufSJdfQ==