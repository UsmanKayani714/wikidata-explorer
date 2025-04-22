# Wikidata Explorer

A simple application to explore and visualize Wikidata entries. This application allows users to search for Wikidata entities and view their properties in an intuitive interface.

## Features

- Search for Wikidata entities
- View entity details including properties, identifiers, and links
- Browse entity information in different languages
- Responsive design for desktop and mobile

## Technologies Used

- Next.js 14 (App Router)
- React
- Tailwind CSS
- shadcn/ui components
- Wikidata API

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository:

\`\`\`bash
git clone https://github.com/yourusername/wikidata-explorer.git
cd wikidata-explorer
\`\`\`

2. Install dependencies:

\`\`\`bash
npm install
# or
yarn install
\`\`\`

3. Start the development server:

\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- \`app/\` - Next.js App Router pages and API routes
- \`components/\` - React components
- \`hooks/\` - Custom React hooks
- \`public/\` - Static assets

## API Routes

- \`GET /api/search\` - Search for Wikidata entities
- \`GET /api/entity\` - Get detailed information about a specific entity

## Design Decisions

### UI/UX

- The application uses a clean, minimalist design to focus on the data
- The layout is divided into a search results panel and a details panel
- Information is organized into tabs for better readability
- Responsive design ensures usability on all device sizes

### Data Handling

- The application uses the Wikidata API to search for entities
- Entity details are fetched and processed to provide a more user-friendly representation
- Properties are categorized into basic properties, identifiers, and statements
- Links to external resources are provided where available

## Future Improvements

- Add visualization of relationships between entities
- Implement caching for better performance
- Add support for SPARQL queries
- Improve property labels and descriptions
- Add image galleries for entities with multiple images
- Implement advanced search filters

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Wikidata](https://www.wikidata.org/) for providing the open data
- [Next.js](https://nextjs.org/) for the React framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [shadcn/ui](https://ui.shadcn.com/) for UI components
\`\`\`
