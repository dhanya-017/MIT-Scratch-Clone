import React from 'react';
import './styles.css';
import { Box, Tabs, Tab } from '@mui/material';

const tabs = ['small', 'medium', 'large'];

export const Resize = (props) => {
    const { setSize, size } = props;
    const [value, setValue] = React.useState(tabs.indexOf(size));

    const handleChange = (event, newValue) => {
        setValue(newValue);
        setSize(tabs[newValue]);
    };

    return (
        <Box className='spriteContainer'
            sx={{
                padding: '10px',
                flexGrow: 1, 
                fontFamily: 'monospace',
                height: '80px',
                maxWidth: '350px',
                background: 'white',
                borderRadius: '20px',
            }}
        >
            <span style={{color: 'grey', fontFamily: 'monospace', fontSize: '13px'}}>Resize</span>
            <Box sx={{
                padding: '10px',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    centered
                    sx={{
                        minWidth: 250,
                        '& .MuiTab-root': {
                            color: '#007FFF',
                            '&.Mui-selected': {
                                color: '#0072E5',
                            },
                        },
                    }}
                >
                    {tabs.map((item) => (
                        <Tab key={item} label={item} />
                    ))}
                </Tabs>
            </Box>
        </Box>
    );
};

export default Resize; 