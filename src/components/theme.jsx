// src/theme.js
import { createTheme } from '@mui/material/styles';

export const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // Açık tema renkleri
          primary: { main: '#1976d2' },
          background: { default: '#f5f5f5', paper: '#fff' },
          text: { primary: '#000' },
        }
      : {
          // Karanlık tema renkleri
          primary: { main: '#90caf9' },
          background: { default: '#121212', paper: '#1e1e1e' },
          text: { primary: '#fff' },
        }),
  },
});

export const createAppTheme = (mode) => createTheme(getDesignTokens(mode));


// src/App.js
import React, { useMemo, useState } from 'react';
import { ThemeProvider, CssBaseline, IconButton } from '@mui/material';
import { createAppTheme } from './theme';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import DrawerMenu from './components/DrawerMenu';
import ProductTable from './components/ProductTable';

function App() {
  const [mode, setMode] = useState('light');

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  const toggleMode = () => setMode((prev) => (prev === 'light' ? 'dark' : 'light'));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem' }}>
        <IconButton onClick={toggleMode} color="inherit">
          {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
      </div>
      <DrawerMenu />
      <ProductTable />
    </ThemeProvider>
  );
}

export default App;

/*
<DrawerMenu mode={mode} onToggleTheme={toggleMode} />

import { Switch, ListItem, ListItemText } from '@mui/material';

function DrawerMenu({ mode, onToggleTheme }) {
  return (
    <div>
      <ListItem>
        <ListItemText primary="Dark Mode" />
        <Switch checked={mode === 'dark'} onChange={onToggleTheme} />
      </ListItem>
    </div>
  );
}

export default DrawerMenu;
*/

/**
 *   const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Kullanıcı yazdıkça hatayı temizleyelim
    setError((prev) => ({ ...prev, [`${name}Error`]: '' }));
  };
 */

  /**
   *   const isKuraliKontrol = () => {
    let isValid = true;
    const newErrors = { ...error };

    if (form.name.trim().length < 3) {
      newErrors.nameError = 'İsim en az 3 karakter olmalı';
      isValid = false;
    } else {
      newErrors.nameError = '';
    }

    if (form.surname.trim().length < 2) {
      newErrors.surnameError = 'Soyisim en az 2 karakter olmalı';
      isValid = false;
    } else {
      newErrors.surnameError = '';
    }

    setError(newErrors);
    return isValid;
  };


  const handleSave = () => {
    if (!isKuraliKontrol()) return; // kurallar sağlanmıyorsa kaydetme

    console.log('Kaydedilen veri:', form);
    setOpen(false);
  };

    <TextField
            label="Soyad"
            name="surname"
            value={form.surname}
            onChange={handleChange}
            error={!!error.surnameError}
            helperText={error.surnameError}
            fullWidth
          />
          
   */