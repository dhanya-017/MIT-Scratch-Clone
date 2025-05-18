import React, { useState } from "react";
import './styles.css';
import { 
  Box, 
  Button, 
  TextField, 
  Typography,
  Tooltip,
  Zoom,
  IconButton
} from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import NavigationIcon from '@mui/icons-material/Navigation';

export const Positions = (props) => {
    const { handleMove, refresh } = props;
    const [xInput, setXInput] = useState('');
    const [yInput, setYInput] = useState('');
    const [errors, setErrors] = useState({ x: '', y: '' });

    const validateInputs = () => {
        const newErrors = { x: '', y: '' };
        let isValid = true;

        if (!xInput) {
            newErrors.x = 'X coordinate is required';
            isValid = false;
        } else if (isNaN(xInput)) {
            newErrors.x = 'Must be a number';
            isValid = false;
        }

        if (!yInput) {
            newErrors.y = 'Y coordinate is required';
            isValid = false;
        } else if (isNaN(yInput)) {
            newErrors.y = 'Must be a number';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleClick = () => {
        if (validateInputs()) {
            handleMove(xInput, yInput, false, 0, true);
        }
    };

    const clear = () => {
        setXInput('');
        setYInput('');
        setErrors({ x: '', y: '' });
        refresh();
    };

  return (
        <Box
            className='spriteContainer'
        sx={{
                padding: '20px',
            flexGrow: 1, 
                fontFamily: 'Inter, system-ui, sans-serif',
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease',
                '&:hover': {
                    boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                },
            }}
        >
            <Box sx={{ marginBottom: '16px' }}>
                <Typography 
                    variant='subtitle2' 
                    sx={{
                        color: '#ed6c02',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                    }}
                >
                    Note:
                    <Typography 
                        component="span" 
                        sx={{
                            color: 'text.secondary',
                            fontSize: '0.875rem',
                            fontWeight: 400
                        }}
                    >
            Enter both x and y values
                    </Typography>
                </Typography>
            </Box>

            <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: '16px',
                alignItems: { xs: 'stretch', sm: 'center' },
        }}>
            <TextField
                    id="x-coordinate"
                    label="X Coordinate"
                value={xInput}
                    onChange={(e) => setXInput(e.target.value)}
                    error={!!errors.x}
                    helperText={errors.x}
                size='small'
                sx={{
                        minWidth: '120px',
                        '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                                borderColor: 'primary.main',
                            },
                        },
                }}
            />
            <TextField
                    id="y-coordinate"
                    label="Y Coordinate"
                value={yInput}
                    onChange={(e) => setYInput(e.target.value)}
                    error={!!errors.y}
                    helperText={errors.y}
                size='small'
                sx={{
                        minWidth: '120px',
                        '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                                borderColor: 'primary.main',
                            },
                        },
                    }}
                />
                <Box sx={{ 
                    display: 'flex', 
                    gap: '8px',
                    alignItems: 'center',
                    justifyContent: { xs: 'flex-end', sm: 'flex-start' }
                }}>
                    <Tooltip title="Move sprite to coordinates" TransitionComponent={Zoom}>
                        <Button 
                            variant="contained" 
                            size='small' 
                            color='primary' 
                            onClick={handleClick}
                            startIcon={<NavigationIcon />}
                            sx={{
                                borderRadius: '8px',
                                textTransform: 'none',
                                fontWeight: 600,
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    transform: 'translateY(-1px)',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                },
                            }}
                        >
                            Move
                        </Button>
                    </Tooltip>
                    <Tooltip title="Reset coordinates" TransitionComponent={Zoom}>
                        <IconButton 
                            onClick={clear}
                            size="small"
                            sx={{
                                color: 'text.secondary',
                                '&:hover': {
                                    color: 'primary.main',
                                    backgroundColor: 'rgba(25, 118, 210, 0.04)',
                                },
                            }}
                        >
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>
    </Box>
  );
};

export default Positions;