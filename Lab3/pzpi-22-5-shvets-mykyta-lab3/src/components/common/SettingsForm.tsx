// src/components/common/SettingsForm.tsx
'use client';

import React, { useState } from 'react';
import {
    Box,
    Avatar,
    Typography,
    Button,
    Switch,
    FormControlLabel,
    Select,
    MenuItem,
    TextField,
    Snackbar,
    Alert,
    Divider,
    Paper,
    styled,
    InputAdornment,
    IconButton,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useAuth } from '@/context/AuthContext';
import { useThemeContext } from '@/context/ThemeContext';
import { useTranslation } from 'react-i18next';

const Container = styled(Paper)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(4),
    padding: theme.spacing(4),
    borderRadius: theme.spacing(2),
    maxWidth: 900,
    margin: '0 auto',
    flexWrap: 'wrap',
}));

export const SettingsForm: React.FC = () => {
    const { user, updateAvatar, changePassword } = useAuth();
    const { mode, toggleMode } = useThemeContext();
    const { t, i18n } = useTranslation('settings');

    const [file, setFile] = useState<File | null>(null);
    const [lang, setLang] = useState<'en' | 'uk'>(i18n.language as 'en' | 'uk');

    const [oldPwd, setOldPwd] = useState('');
    const [newPwd, setNewPwd] = useState('');
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);

    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        severity: 'success' | 'error';
        message: string;
    }>({ open: false, severity: 'success', message: '' });

    // требования к паролю
    const requirements = [
        { key: 'minLength', test: (p: string) => p.length >= 8 },
        { key: 'uppercase', test: (p: string) => /[A-Z]/.test(p) },
        { key: 'lowercase', test: (p: string) => /[a-z]/.test(p) },
        { key: 'number',    test: (p: string) => /[0-9]/.test(p) },
        { key: 'special',   test: (p: string) => /[^A-Za-z0-9]/.test(p) },
    ];

    const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) setFile(e.target.files[0]);
    };
    const saveAvatar = async () => {
        if (!file) return;
        const form = new FormData();
        form.append('avatar', file);
        await updateAvatar(form);
        setFile(null);
    };

    const savePassword = async () => {
        const { success, message } = await changePassword(oldPwd, newPwd);
        setSnackbar({
            open: true,
            severity: success ? 'success' : 'error',
            message: success ? t('passwordChanged') : message,
        });
        if (success) {
            setOldPwd('');
            setNewPwd('');
        }
    };

    const onLangChange = (e: React.ChangeEvent<{ value: unknown }>) => {
        const lng = e.target.value as 'en' | 'uk';
        i18n.changeLanguage(lng);
        setLang(lng);
    };

    return (
        <>
            <Container elevation={1}>
                {/* профиль */}
                <Box sx={{ width: 240, textAlign: 'center' }}>
                    <Avatar
                        src={user?.avatarUrl}
                        sx={{ width: 120, height: 120, mx: 'auto' }}
                    />
                    <Typography variant="h6" mt={2}>
                        {user?.firstName} {user?.lastName}
                    </Typography>
                    <Typography color="text.secondary" mb={2}>
                        {user?.role}
                    </Typography>

                    <Button variant="outlined" component="label" fullWidth>
                        {t('uploadPhoto')}
                        <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={onAvatarChange}
                        />
                    </Button>
                    {file && (
                        <Button
                            variant="contained"
                            onClick={saveAvatar}
                            fullWidth
                            sx={{ mt: 1 }}
                        >
                            {t('savePhoto')}
                        </Button>
                    )}
                </Box>

                <Divider orientation="vertical" flexItem />

                {/* настройки */}
                <Box
                    sx={{
                        flex: 1,
                        minWidth: 300,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 4,
                    }}
                >
                    {/* тема */}
                    <Box>
                        <Typography variant="subtitle1" gutterBottom>
                            {t('theme')}
                        </Typography>
                        <FormControlLabel
                            control={<Switch checked={mode==='dark'} onChange={toggleMode} />}
                            label={ mode==='dark' ? t('dark') : t('light') }
                        />
                    </Box>

                    {/* язык */}
                    <Box>
                        <Typography variant="subtitle1" gutterBottom>
                            {t('language')}
                        </Typography>
                        <Select value={lang} size="small" onChange={onLangChange} fullWidth>
                            <MenuItem value="en">English</MenuItem>
                            <MenuItem value="uk">Українська</MenuItem>
                        </Select>
                    </Box>

                    <Divider />

                    {/* смена пароля */}
                    <Box display="flex" flexDirection="column" gap={2}>
                        <Typography variant="subtitle1">
                            {t('changePassword')}
                        </Typography>

                        {/* старый пароль */}
                        <TextField
                            type={ showOld ? 'text' : 'password' }
                            label={t('oldPassword')}
                            size="small"
                            fullWidth
                            value={oldPwd}
                            onChange={e => setOldPwd(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={()=>setShowOld(v=>!v)} edge="end">
                                            { showOld ? <VisibilityOffIcon/> : <VisibilityIcon/> }
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        {/* новый пароль */}
                        <TextField
                            type={ showNew ? 'text' : 'password' }
                            label={t('newPassword')}
                            size="small"
                            fullWidth
                            value={newPwd}
                            onChange={e => setNewPwd(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={()=>setShowNew(v=>!v)} edge="end">
                                            { showNew ? <VisibilityOffIcon/> : <VisibilityIcon/> }
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        {/* требования */}
                        <Box>
                            <Typography variant="subtitle2" gutterBottom>
                                {t('requirements.title')}
                            </Typography>
                            {requirements.map(req => {
                                const ok = req.test(newPwd);
                                return (
                                    <Box
                                        key={req.key}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            color: ok ? 'success.main' : 'text.secondary',
                                            mb: 0.5,
                                        }}
                                    >
                                        {ok
                                            ? <CheckCircleIcon fontSize="small" />
                                            : <CancelIcon      fontSize="small" />}
                                        <Typography variant="body2" sx={{ ml: 1 }}>
                                            {t(`requirements.${req.key}`)}
                                        </Typography>
                                    </Box>
                                );
                            })}
                        </Box>

                        <Button
                            variant="contained"
                            onClick={savePassword}
                            disabled={!oldPwd || !newPwd}
                        >
                            {t('savePassword')}
                        </Button>
                    </Box>
                </Box>
            </Container>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={()=>setSnackbar(s=>({...s,open:false}))}
            >
                <Alert
                    onClose={()=>setSnackbar(s=>({...s,open:false}))}
                    severity={snackbar.severity}
                    sx={{ width:'100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};
