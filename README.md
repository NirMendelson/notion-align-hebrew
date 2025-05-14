# Notion Align Hebrew

**Production-ready**

- Debug logging removed for clean usage
- Mixed Hebrew/English blocks now align right and use RTL if Hebrew ratio > 0.3
- Handles punctuation and directionality for Hebrew and English

A Chrome extension that automatically detects and adjusts text alignment in Notion based on the language content. The extension intelligently handles mixed Hebrew and English text, providing optimal reading experience for bilingual content.

## Features

- Automatic detection of Hebrew and English text
- Dynamic text alignment based on language content
- Smart handling of mixed language content
- Sentence-level alignment decisions
- Seamless integration with Notion's interface

## How It Works

The extension analyzes text content in Notion and:
1. Detects the presence of Hebrew and English characters
2. For pure language content:
   - Hebrew text is aligned to the right
   - English text is aligned to the left
3. For mixed content:
   - Analyzes the ratio of Hebrew to English words in each sentence
   - Aligns the text based on the dominant language
   - Uses sentence boundaries (periods) to determine alignment segments

## Project Tasks

### Setup and Configuration
- [x] Initialize Chrome extension project structure
- [x] Create manifest.json with necessary permissions
- [x] Set up development environment
- [x] Configure build process

### Core Functionality
- [x] Implement Hebrew character detection
- [x] Implement English character detection
- [x] Create text analysis algorithm for mixed content
- [x] Develop sentence boundary detection
- [x] Implement alignment logic based on language dominance
- [x] Implement live alignment as user types

### Component Support
- [x] Implement alignment for regular paragraph text
- [x] Add support for heading components (h1, h2, h3)
- [x] Add support for to-do list items
- [x] Add support for bullet points and numbered lists

### Notion Integration
- [x] Create content script for Notion page injection
- [x] Implement DOM mutation observer for dynamic content
- [x] Handle Notion's rich text editor
- [x] Ensure compatibility with Notion's block structure

### User Experience
- [ ] Add extension icon and popup
- [ ] Create user settings interface
- [ ] Implement on/off toggle
- [ ] Add visual feedback for alignment changes

### Testing and Quality Assurance
- [ ] Write unit tests for language detection
- [ ] Test with various text combinations
- [ ] Perform cross-browser testing
- [ ] Test with different Notion page types

### Documentation and Deployment
- [ ] Complete user documentation
- [ ] Create installation guide
- [ ] Prepare Chrome Web Store listing
- [ ] Set up automated deployment process

## Deployment to Chrome Web Store

1. **Prepare Your Extension**
   - Ensure all files are in the root directory
   - Verify manifest.json is properly configured
   - Test the extension thoroughly

2. **Package Your Extension**
   - Create a ZIP file containing:
     - manifest.json
     - content.js
     - popup.html
     - popup.js
     - styles.css
     - icons/ (directory with all icon sizes)

3. **Chrome Web Store Submission**
   - Go to [Chrome Developer Dashboard](https://chrome.google.com/webstore/devconsole)
   - Pay one-time $5 developer registration fee
   - Click "New Item" and upload your ZIP file
   - Fill in the store listing:
     - Detailed description
     - At least 2 screenshots
     - Small tile image (128x128)
     - Large tile image (440x280)
     - Category: Productivity
     - Language: English
   - Set visibility (Public/Unlisted)
   - Submit for review

4. **Post-Submission**
   - Wait for review (usually 2-3 business days)
   - Address any feedback from reviewers
   - Once approved, your extension will be live

## Technical Requirements

- Chrome Extension Manifest V3
- JavaScript/TypeScript
- DOM manipulation
- Regular expressions for language detection
- Notion API integration (if needed)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 