import { useState, useEffect } from 'react';
import {
    Box, Typography, Paper, TextField, Button,
    Divider, CircularProgress, Chip, Avatar
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { getProfile, updateProfile, changePassword } from '../api/profileApi';
import { useSnackbar } from '../context/SnackbarContext';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
    const { showSnackbar } = useSnackbar();
    const { updateUser } = useAuth();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    // Ad-soyad güncelleme
    const [fullName, setFullName] = useState('');
    const [nameLoading, setNameLoading] = useState(false);

    // Parola değiştirme
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await getProfile();
            setProfile(res.data.data);
            setFullName(res.data.data.fullName);
        } catch {
            showSnackbar('Profil bilgileri yüklenemedi.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateName = async () => {
        if (!fullName.trim() || fullName.trim().length < 2) {
            showSnackbar('Ad-soyad en az 2 karakter olmalıdır.', 'warning');
            return;
        }
        setNameLoading(true);
        try {
            const res = await updateProfile({ fullName: fullName.trim() });
            // Yeni token'ı localStorage'a yaz
            if (res.data.token) {
                localStorage.setItem('token', res.data.token);
            }
            updateUser({ fullName: fullName.trim() });
            showSnackbar('Ad-soyad başarıyla güncellendi.', 'success');
            fetchProfile();
        } catch {
            showSnackbar('Güncelleme başarısız.', 'error');
        } finally {
            setNameLoading(false);
        }
    };

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            showSnackbar('Tüm alanları doldurun.', 'warning');
            return;
        }
        if (newPassword.length < 8) {
            showSnackbar('Yeni parola en az 8 karakter olmalıdır.', 'warning');
            return;
        }
        if (newPassword !== confirmPassword) {
            showSnackbar('Yeni parolalar eşleşmiyor.', 'warning');
            return;
        }
        setPasswordLoading(true);
        try {
            await changePassword({ currentPassword, newPassword, confirmPassword });
            showSnackbar('Parola başarıyla değiştirildi.', 'success');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            const msg = err.response?.data?.message || 'Parola değiştirilemedi.';
            showSnackbar(msg, 'error');
        } finally {
            setPasswordLoading(false);
        }
    };

    
        const formatDate = (dateStr) => {
            if (!dateStr) return 'Henüz giriş yapılmadı';
            
            
            const utcDateStr = dateStr.endsWith('Z') || dateStr.includes('+') ? dateStr : `${dateStr}Z`;
            
            return new Date(utcDateStr).toLocaleString('tr-TR', {
                timeZone: 'Europe/Istanbul',
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric',
                hour: '2-digit', 
                minute: '2-digit'
            });
        };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 680, mx: 'auto', p: 3 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Profilim
            </Typography>

            {/* Profil Bilgi Kartı */}
            <Paper sx={{ p: 3, mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main', fontSize: 28 }}>
                    {profile?.fullName?.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                    <Typography variant="h6" fontWeight="bold">{profile?.fullName}</Typography>
                    <Typography variant="body2" color="text.secondary">{profile?.email}</Typography>
                    <Chip label={profile?.role} size="small" color="primary" sx={{ mt: 0.5 }} />
                </Box>
            </Paper>

            {/* Son Giriş Bilgisi */}
            <Paper sx={{ p: 2.5, mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <AccessTimeIcon color="action" />
                <Box>
                    <Typography variant="body2" color="text.secondary">Son Giriş</Typography>
                    <Typography variant="body1">{formatDate(profile?.lastLoginDate)}</Typography>
                </Box>
            </Paper>

            {/* Ad-Soyad Güncelleme */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <PersonIcon color="primary" />
                    <Typography variant="h6" fontWeight="bold">Ad-Soyad Güncelle</Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <TextField
                    fullWidth
                    label="Ad-Soyad"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <Button
                    variant="contained"
                    onClick={handleUpdateName}
                    disabled={nameLoading}
                    startIcon={nameLoading ? <CircularProgress size={18} color="inherit" /> : null}
                >
                    {nameLoading ? 'Güncelleniyor...' : 'Güncelle'}
                </Button>
            </Paper>

            {/* Parola Değiştirme */}
            <Paper sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <LockIcon color="primary" />
                    <Typography variant="h6" fontWeight="bold">Parola Değiştir</Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <TextField
                    fullWidth
                    type="password"
                    label="Mevcut Parola"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    type="password"
                    label="Yeni Parola"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    type="password"
                    label="Yeni Parola Tekrar"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <Button
                    variant="contained"
                    color="warning"
                    onClick={handleChangePassword}
                    disabled={passwordLoading}
                    startIcon={passwordLoading ? <CircularProgress size={18} color="inherit" /> : null}
                >
                    {passwordLoading ? 'Değiştiriliyor...' : 'Parolayı Değiştir'}
                </Button>
            </Paper>
        </Box>
    );
}