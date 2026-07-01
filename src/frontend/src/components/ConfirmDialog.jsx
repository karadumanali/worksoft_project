import {
  Dialog, DialogContent, DialogActions,
  Button, Typography
} from "@mui/material";

function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <Dialog open onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogContent sx={{ textAlign: "center", pt: 4, pb: 2 }}>
        <Typography variant="body1">{message}</Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", pb: 3, gap: 2 }}>
        <Button variant="contained" onClick={onConfirm}>Evet</Button>
        <Button variant="outlined" color="inherit" onClick={onCancel}>Hayır</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDialog;