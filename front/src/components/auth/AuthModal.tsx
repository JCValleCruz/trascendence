// src/components/auth/AuthModal.tsx
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useUI } from '../../context/UIContext';

const AuthModal = () => {
  const { modalType, closeModal } = useUI();

  return (
    <Dialog 
      open={Boolean(modalType)} 
      onClose={closeModal}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle sx={{ m: 0, p: 2, textAlign: 'center' }}>
        {modalType === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
        <IconButton
          onClick={closeModal}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {/* Aquí irán tus formularios más adelante */}
        {modalType === 'login' ? <p>Formulario de Login</p> : <p>Formulario de Registro</p>}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;