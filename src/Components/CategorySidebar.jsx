import React from 'react';
import { Box } from '@mui/material';

const categories = [
    { name: 'Motion', color: '#4C97FF' },
    { name: 'Looks', color: '#9966FF' },
    { name: 'Control', color: '#FFAB19' }
];

export const CategorySidebar = ({ activeCategory, onCategoryClick }) => {
    return (
        <Box
            sx={{
                width: '60px',
                backgroundColor: '#ffffff',
                borderRight: '1px solid #e0e0e0',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                padding: '8px 0',
                height: '70vh',
                overflowY: 'auto'
            }}
        >
            {categories.map((category) => {
                const isActive = activeCategory === category.name;
                
                return (
                    <Box
                        key={category.name}
                        onClick={() => onCategoryClick(category.name)}
                        sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            padding: '8px 0',
                            cursor: 'pointer',
                            backgroundColor: isActive ? `${category.color}20` : 'transparent',
                            borderLeft: isActive ? `4px solid ${category.color}` : '4px solid transparent',
                            '&:hover': {
                                backgroundColor: `${category.color}10`,
                            }
                        }}
                    >
                        <Box
                            sx={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                backgroundColor: category.color,
                                marginBottom: '4px'
                            }}
                        />
                        <Box
                            sx={{
                                fontSize: '10px',
                                textAlign: 'center',
                                color: '#575e75',
                                fontFamily: 'monospace'
                            }}
                        >
                            {category.name}
                        </Box>
                    </Box>
                );
            })}
        </Box>
    );
};

export default CategorySidebar; 