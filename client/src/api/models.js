export class transactionAttempt {
    constructor () {
        this.createdAt = new Date();
        this.creatorAttrs = {
            location: null,
        };
        this.isBookmark = null;
        this.isIndividual = null;
        this.isStandard = null;
        this.isTransaction = null;
        this.usedSuggestion = null;
    }

    setCreatedAt(newCreationTime) {
        this.createdAt = newCreationTime;
    }

    setCreatorLocation(geopoint) {
        this.creatorAttrs.location = geopoint;
    }

    setIsBookmark(bool) {
        this.isBookmark = bool;
    }

    setIsIndividual(bool) {
        this.isIndividual = bool;
    }

    setIsStandard(bool) {
        this.isStandard = bool;
    }

    setIsTransaction(bool) {
        this.isTransaction = bool;
    }

    setUsedSuggestion(bool) {
        this.usedSuggestion = bool;
    }
}