import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface Home {
    hid: string;
    name: string;
}

interface HomeListProps {
    homes: Home[];
    homeSelect: string;
    setHomeSelect: React.Dispatch<React.SetStateAction<string>>;
}

export default function HomeList({ homes, homeSelect, setHomeSelect }: HomeListProps): JSX.Element {
    const handleChange = (event: SelectChangeEvent) => {
        setHomeSelect(event.target.value as string);
    };

    return (
        <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth sx={{ "& .MuiInputBase-root": { fontSize: "16px" } }}>
                <InputLabel id="demo-simple-select-label">Home</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={homeSelect}
                    label="Home"
                    onChange={handleChange}
                    sx={{ "& .MuiSelect-root": { borderRadius: "8px", backgroundColor: "#f0f0f0" } }}
                >
                    {homes.map((home, index) => (
                        <MenuItem key={index} value={home.hid}>
                            {home.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
}
