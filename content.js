// Constants for language detection
const HEBREW_REGEX = /[\u0590-\u05FF]/;
const ENGLISH_REGEX = /[a-zA-Z]/;

// Initialize the extension
function initialize() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                processNewNodes(mutation.addedNodes);
            } else if (mutation.type === 'characterData') {
                if (mutation.target && mutation.target.nodeType === Node.TEXT_NODE) {
                    processTextNode(mutation.target);
                }
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
    });

    processNewNodes([document.body]);
}

// Process new nodes added to the DOM
function processNewNodes(nodes) {
    if (!nodes) return;
    if (!Array.isArray(nodes) && !(nodes instanceof NodeList)) {
        nodes = [nodes];
    } else if (nodes instanceof NodeList) {
        nodes = Array.from(nodes);
    }
    nodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
            processTextNode(node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            if (shouldSkipElement(node)) return;
            Array.from(node.childNodes).forEach(processNewNodes);
        }
    });
}

// Check if element should be skipped
function shouldSkipElement(element) {
    if (!element.offsetParent) return true;
    if (element.dataset.rtlProcessed === 'true') return true;
    const skipClasses = ['notion-page-controls', 'notion-sidebar'];
    if (skipClasses.some(className => element.classList.contains(className))) return true;
    return false;
}

// Inject custom stylesheet for RTL/LTR alignment
(function injectNotionRtlStyle() {
    if (document.getElementById('notion-rtl-style')) return;
    const style = document.createElement('style');
    style.id = 'notion-rtl-style';
    style.textContent = `
      [data-block-id][data-rtl-align="right"] {
        text-align: right !important;
        direction: rtl !important;
      }
      [data-block-id][data-rtl-align="left"] {
        text-align: left !important;
        direction: ltr !important;
      }
      /* Higher specificity selectors for page block */
      .notion-page-block[data-rtl-align="right"] h1[contenteditable="true"] {
        text-align: right !important;
        direction: rtl !important;
      }
      .notion-page-block[data-rtl-align="left"] h1[contenteditable="true"] {
        text-align: left !important;
        direction: ltr !important;
      }
    `;
    document.head.appendChild(style);
})();

// Store observers to avoid duplicates
const blockObservers = new WeakMap();
const pageBlockObservers = new WeakMap();

// Handle page block specifically
function handlePageBlock(block) {
    const h1Element = block.querySelector('h1[contenteditable="true"]');
    if (!h1Element) return;

    const text = h1Element.textContent;
    const alignment = determineAlignment(text);

    // Set data attribute for CSS targeting
    block.setAttribute('data-rtl-align', alignment);

    // Apply styles to block
    block.style.setProperty('text-align', alignment, 'important');
    block.style.setProperty('direction', alignment === 'right' ? 'rtl' : 'ltr', 'important');

    // Set up observer only if not already observing
    if (!pageBlockObservers.has(block)) {
        const observer = new MutationObserver((mutations) => {
            // Only process if the text content actually changed
            const newText = h1Element.textContent;
            if (newText !== text) {
                const newAlignment = determineAlignment(newText);
                block.setAttribute('data-rtl-align', newAlignment);
                block.style.setProperty('text-align', newAlignment, 'important');
                block.style.setProperty('direction', newAlignment === 'right' ? 'rtl' : 'ltr', 'important');
            }
        });

        observer.observe(h1Element, {
            characterData: true,
            childList: true,
            subtree: true
        });

        pageBlockObservers.set(block, observer);
    }
}

// Process a text node and adjust its alignment
function processTextNode(node) {
    let text = node.textContent;
    if (!text.trim()) return;

    let block = node.parentElement;
    while (block && (!block.classList || 
           (!block.classList.contains('notion-text-block') && 
            !block.classList.contains('notion-header-block') &&
            !block.classList.contains('notion-sub_header-block') &&
            !block.classList.contains('notion-sub_sub_header-block') &&
            !block.classList.contains('notion-to_do-block') &&
            !block.classList.contains('notion-bulleted_list-block') &&
            !block.classList.contains('notion-numbered_list-block') &&
            !block.classList.contains('notion-page-block')))) {
        block = block.parentElement;
    }
    if (!block) return;

    // Handle page block separately
    if (block.classList.contains('notion-page-block')) {
        handlePageBlock(block);
        return;
    }

    const alignment = determineAlignment(text);
    
    if (alignment === 'right') {
        block.style.setProperty('text-align', 'right', 'important');
        block.style.setProperty('direction', 'rtl', 'important');
    } else {
        block.style.setProperty('text-align', 'left', 'important');
        block.style.setProperty('direction', 'ltr', 'important');
    }

    if (!blockObservers.has(block)) {
        const observer = new MutationObserver(() => {
            if (alignment === 'right') {
                block.style.setProperty('text-align', 'right', 'important');
                block.style.setProperty('direction', 'rtl', 'important');
            } else {
                block.style.setProperty('text-align', 'left', 'important');
                block.style.setProperty('direction', 'ltr', 'important');
            }
        });
        observer.observe(block, { attributes: true, attributeFilter: ['style'] });
        blockObservers.set(block, observer);
    }
}

// Determine text alignment based on content
function determineAlignment(text) {
    const hasHebrew = HEBREW_REGEX.test(text);
    const hasEnglish = ENGLISH_REGEX.test(text);
    if (hasHebrew && !hasEnglish) return 'right';
    if (!hasHebrew && hasEnglish) return 'left';
    if (hasHebrew && hasEnglish) {
        const ratio = countLanguageRatio(text);
        return ratio > 0.3 ? 'right' : 'left';
    }
    return 'left';
}

// Count the ratio of Hebrew to total words
function countLanguageRatio(text) {
    const words = text.split(/\s+/).filter(word => word.length > 0);
    const hebrewWords = words.filter(word => HEBREW_REGEX.test(word));
    return hebrewWords.length / words.length;
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'toggle') {
        if (request.enabled) {
            processNewNodes([document.body]);
        }
    }
});

// Start the extension
initialize(); 