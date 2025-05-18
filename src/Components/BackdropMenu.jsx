import React, { useState } from 'react';
import { Box, Button, Menu, MenuItem, IconButton } from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import CollectionsIcon from '@mui/icons-material/Collections';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import SlideshowIcon from '@mui/icons-material/Slideshow';

const defaultBackdrops = [
    { name: 'Forest', url: 'https://www.hp.com/us-en/shop/app/assets/images/uploads/prod/misty-forest-background1595620320482968.jpg?impolicy=prdimg&imdensity=1&imwidth=1000' },
    { name: 'Beach', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000' },
    { name: 'Space', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1000' },
    { name: 'City', url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1000' },
];

export const BackdropMenu = ({ onBackdropChange }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [showLibrary, setShowLibrary] = useState(false);
    const fileInputRef = React.useRef(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setShowLibrary(false);
    };

    const handleUpload = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result;
                if (typeof result === 'string') {
                    onBackdropChange(result);
                    handleClose();
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleLibrarySelect = (backdrop) => {
        onBackdropChange(backdrop.url);
        handleClose();
    };

    return (
        <Box sx={{ position: 'absolute', right: '10px', top: '10px' }}>
            <Button
                variant="contained"
                onClick={handleClick}
                sx={{
                    backgroundColor: '#9966FF',
                    borderRadius: '20px',
                    '&:hover': {
                        backgroundColor: '#7744CC'
                    }
                }}
            >
                Choose a Backdrop
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                sx={{ '& .MuiPaper-root': { backgroundColor: '#9966FF', borderRadius: '12px' } }}
            >
                {showLibrary ? (
                    <Box sx={{ p: 2, width: '300px' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Button 
                                onClick={() => setShowLibrary(false)}
                                sx={{ color: 'white' }}
                            >
                                Back
                            </Button>
                            <Button 
                                onClick={handleClose}
                                sx={{ color: 'white' }}
                            >
                                Close
                            </Button>
                        </Box>
                        <Box sx={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: 2 
                        }}>
                            {defaultBackdrops.map((backdrop, index) => (
                                <Box 
                                    key={index}
                                    onClick={() => handleLibrarySelect(backdrop)}
                                    sx={{
                                        height: '100px',
                                        backgroundImage: `url(${backdrop.url})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            opacity: 0.8
                                        }
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>
                ) : (
                    <>
                        <MenuItem onClick={() => fileInputRef.current?.click()}>
                            <FileUploadIcon sx={{ mr: 1 }} /> Upload
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                accept="image/*"
                                onChange={handleUpload}
                            />
                        </MenuItem>
                        <MenuItem onClick={() => setShowLibrary(true)}>
                            <CollectionsIcon sx={{ mr: 1 }} /> Choose from Library
                        </MenuItem>
                        <MenuItem onClick={() => onBackdropChange(null)}>
                            <DeleteIcon sx={{ mr: 1 }} /> Remove Backdrop
                        </MenuItem>
                    </>
                )}
            </Menu>
        </Box>
    );
};

export default BackdropMenu; 