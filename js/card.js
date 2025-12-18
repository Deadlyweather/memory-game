export function createCardElement(cardHTML) {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    return cardElement;
}

export function flipCard(cardElement, callback) {
    callback(cardElement);
}