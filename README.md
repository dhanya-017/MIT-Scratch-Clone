# MIT Scratch Clone 🎮

<div align="center">

![MIT Scratch Clone](https://img.shields.io/badge/MIT-Scratch%20Clone-blue)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue)
![License](https://img.shields.io/badge/License-MIT-green)

A modern web-based implementation of MIT's Scratch programming environment, built with React and TypeScript. This project provides a visual programming interface where users can create programs by dragging and dropping code blocks.

[Live Demo](https://mit-scratch-clone-tan.vercel.app/) • [Documentation](https://github.com/dhanya-017/MIT-Scratch-Clone/wiki) • [Report Bug](https://github.com/dhanya-017/MIT-Scratch-Clone/issues)

</div>

## 📋 Table of Contents

- [Features](#-features)
- [Video Demonstration](#-video-demonstration)
- [Technology Stack](#-technology-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Key Features Implementation](#-key-features-implementation)
- [Development](#-development)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

## 🚀 Features

- **Visual Programming Interface**
  - Intuitive drag-and-drop programming blocks
  - Real-time block manipulation
  - Visual feedback for block interactions

- **Multiple Action Areas**
  - Support for two separate action areas
  - Independent block management
  - Flexible programming space

- **Modern UI/UX**
  - Material-UI components
  - Tailwind CSS styling
  - Responsive design for all screen sizes
  - Smooth animations and transitions

- **Interactive Programming**
  - Real-time block manipulation
  - Immediate visual feedback
  - Error prevention mechanisms
    
## Video Demonstration
  ![image](https://github.com/user-attachments/assets/31cc73e0-3d0b-4732-a315-7e6ed63f6417)
  ![image](https://github.com/user-attachments/assets/2fd9761d-2766-467c-a862-ac9de0c76ece)

  [Working project video link](https://drive.google.com/file/d/1mCvfajGq-Ku_niQKHVYmQm78kKaa6vlV/view?usp=sharing)
  
## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18.2.0
- **Language**: TypeScript 4.9.5
- **UI Libraries**: 
  - Material-UI (MUI) v5.9.0
  - Tailwind CSS v3.4.1
  - Styled Components v5.3.5

### Development Tools
- **Package Manager**: npm
- **Build Tools**: 
  - Webpack
  - PostCSS
  - Autoprefixer
- **Drag and Drop**: react-beautiful-dnd v13.1.0

## 📦 Getting Started

### Prerequisites
- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/dhanya-017/MIT-Scratch-Clone.git
cd MIT-Scratch-Clone
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view the application

## 🏗️ Project Structure

```
src/
├── Components/     # React components
│   ├── eventBody/  # Event handling components
│   ├── navBar/     # Navigation components
│   └── ...
├── hooks/         # Custom React hooks
├── styles/        # Styling files
├── types/         # TypeScript type definitions
├── Assets/        # Static assets
├── App.js         # Main application component
├── constants.js   # Application constants
└── index.js       # Application entry point
```

## 🎯 Key Features Implementation

### Drag and Drop System
- Implemented using react-beautiful-dnd
- Custom drag handles and drop zones
- Visual feedback during drag operations

### Block Management
- State management for programming blocks
- Block validation and error handling
- Block persistence and recovery

### Action Areas
- Multiple action areas with separate state
- Block organization and grouping
- Area-specific block validation

### Responsive Layout
- Tailwind CSS for responsive design
- Mobile-first approach
- Adaptive layouts for different screen sizes

## 🛠️ Development

### Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run eject`: Ejects from Create React App

### Development Guidelines

1. Follow the existing code style
2. Write meaningful commit messages
3. Update documentation for new features
4. Add tests for new functionality

## 👥 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/dhanya-017/MIT-Scratch-Clone/blob/main/LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Dhanya Dwivedi

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 📧 Contact

For any queries or suggestions, please reach out to:

- **Email**: [dhanyadwivedi170304@gmail.com](mailto:dhanyadwivedi170304@gmail.com)
- **GitHub**: [@dhanya-017](https://github.com/dhanya-017)
- **Project Link**: [https://github.com/dhanya-017/MIT-Scratch-Clone](https://github.com/dhanya-017/MIT-Scratch-Clone)

## 🙏 Acknowledgments

- Inspired by MIT's Scratch programming environment
- Built with React and TypeScript
- Special thanks to all contributors and supporters

---

<div align="center">
Made with ❤️ by Dhanya Dwivedi
</div>
