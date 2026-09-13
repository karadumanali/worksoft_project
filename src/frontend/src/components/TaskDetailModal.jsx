import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Box, Typography, Chip
} from "@mui/material";

function TaskDetailModal({ task, onClose }) {
  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Görev Detayı</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <Box>
            <Typography variant="caption" color="text.secondary">Görev Başlığı</Typography>
            <Typography variant="body1">{task.title}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">Atanan Kişi</Typography>
            <Typography variant="body1">{task.assignedUserName}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">Öncelik</Typography>
            <Typography variant="body1">{task.priority}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">Bitiş Tarihi</Typography>
            <Typography variant="body1">{new Date(task.dueDate).toLocaleDateString("tr-TR")}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>Durum</Typography>
            <Chip
              label={task.status}
              color={task.status === "Tamamlandı" ? "success" : "default"}
              size="small"
            />
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">Açıklama</Typography>
            <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
              {task.description ? task.description : "Açıklama girilmemiş."}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">Kapat</Button>
      </DialogActions>
    </Dialog>
  );
}

export default TaskDetailModal;
