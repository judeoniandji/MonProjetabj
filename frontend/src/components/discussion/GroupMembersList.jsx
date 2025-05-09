import React, { useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  Snackbar,
  Tooltip,
  Divider,
  Paper
} from '@mui/material';
import {
  Person as PersonIcon,
  PersonAdd as PersonAddIcon,
  Delete as DeleteIcon,
  AdminPanelSettings as AdminIcon,
  ContentCopy as CopyIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import discussionGroupService from '../../services/discussionGroupService';

const GroupMembersList = ({ members, groupId, isAdmin, onMembersUpdated }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', message: '', action: null });
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const [inviteDialog, setInviteDialog] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  
  // Filtrer les membres en fonction du terme de recherche
  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Gestionnaire pour copier le code d'accès
  const handleCopyAccessCode = () => {
    navigator.clipboard.writeText(accessCode);
    setNotification({
      open: true,
      message: 'Code d\'accès copié dans le presse-papiers',
      severity: 'success'
    });
  };
  
  // Gestionnaire pour ouvrir le dialogue d'invitation
  const handleOpenInviteDialog = async () => {
    try {
      // Récupérer le code d'accès du groupe
      const groupData = await discussionGroupService.getGroupById(groupId);
      setAccessCode(groupData.access_code || 'Ce groupe n\'a pas de code d\'accès');
      setInviteDialog(true);
    } catch (err) {
      setNotification({
        open: true,
        message: err.message || 'Erreur lors de la récupération du code d\'accès',
        severity: 'error'
      });
    }
  };
  
  // Gestionnaire pour fermer le dialogue d'invitation
  const handleCloseInviteDialog = () => {
    setInviteDialog(false);
  };
  
  // Gestionnaire pour promouvoir un membre en admin
  const handlePromoteToAdmin = (memberId) => {
    setConfirmDialog({
      open: true,
      title: 'Promouvoir en administrateur',
      message: 'Êtes-vous sûr de vouloir promouvoir ce membre en administrateur du groupe ?',
      action: async () => {
        try {
          // Appel API pour promouvoir un membre en admin
          await discussionGroupService.updateGroup(groupId, {
            promote_admin: memberId
          });
          
          setNotification({
            open: true,
            message: 'Membre promu en administrateur avec succès',
            severity: 'success'
          });
          
          if (onMembersUpdated) onMembersUpdated();
        } catch (err) {
          setNotification({
            open: true,
            message: err.message || 'Erreur lors de la promotion du membre',
            severity: 'error'
          });
        }
      }
    });
  };
  
  // Gestionnaire pour retirer un membre
  const handleRemoveMember = (memberId) => {
    setConfirmDialog({
      open: true,
      title: 'Retirer le membre',
      message: 'Êtes-vous sûr de vouloir retirer ce membre du groupe ?',
      action: async () => {
        try {
          // Appel API pour retirer un membre
          await discussionGroupService.updateGroup(groupId, {
            remove_member: memberId
          });
          
          setNotification({
            open: true,
            message: 'Membre retiré avec succès',
            severity: 'success'
          });
          
          if (onMembersUpdated) onMembersUpdated();
        } catch (err) {
          setNotification({
            open: true,
            message: err.message || 'Erreur lors du retrait du membre',
            severity: 'error'
          });
        }
      }
    });
  };
  
  // Fermer la notification
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };
  
  // Fermer le dialogue de confirmation
  const handleCloseConfirmDialog = () => {
    setConfirmDialog({ ...confirmDialog, open: false });
  };
  
  // Confirmer l'action dans le dialogue
  const handleConfirmAction = () => {
    if (confirmDialog.action) {
      confirmDialog.action();
    }
    handleCloseConfirmDialog();
  };
  
  return (
    <Box>
      {/* En-tête avec recherche et bouton d'invitation */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <TextField
          placeholder="Rechercher un membre..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
          }}
          variant="outlined"
          sx={{ width: '300px' }}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<PersonAddIcon />}
          onClick={handleOpenInviteDialog}
        >
          Inviter des membres
        </Button>
      </Box>
      
      {/* Statistiques des membres */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Statistiques du groupe
        </Typography>
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Nombre total de membres
            </Typography>
            <Typography variant="h5">
              {members.length}
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Administrateurs
            </Typography>
            <Typography variant="h5">
              {members.filter(m => m.is_admin).length}
            </Typography>
          </Box>
        </Box>
      </Paper>
      
      {/* Liste des administrateurs */}
      <Typography variant="h6" gutterBottom>
        Administrateurs
      </Typography>
      <Paper sx={{ mb: 3 }}>
        <List>
          {members.filter(member => member.is_admin).length === 0 ? (
            <ListItem>
              <ListItemText primary="Aucun administrateur trouvé" />
            </ListItem>
          ) : (
            members
              .filter(member => member.is_admin)
              .map(member => (
                <ListItem key={member.id}>
                  <ListItemAvatar>
                    <Avatar>
                      <AdminIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={member.name}
                    secondary={member.email}
                  />
                  <Chip
                    label="Administrateur"
                    color="primary"
                    size="small"
                    icon={<AdminIcon />}
                  />
                </ListItem>
              ))
          )}
        </List>
      </Paper>
      
      {/* Liste des membres réguliers */}
      <Typography variant="h6" gutterBottom>
        Membres
      </Typography>
      <Paper>
        <List>
          {filteredMembers.filter(member => !member.is_admin).length === 0 ? (
            <ListItem>
              <ListItemText primary="Aucun membre régulier trouvé" />
            </ListItem>
          ) : (
            filteredMembers
              .filter(member => !member.is_admin)
              .map(member => (
                <React.Fragment key={member.id}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <PersonIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={member.name}
                      secondary={
                        <>
                          {member.email}
                          <br />
                          <Typography variant="caption" color="textSecondary">
                            Membre depuis {new Date(member.joined_at).toLocaleDateString()}
                          </Typography>
                        </>
                      }
                    />
                    {isAdmin && (
                      <ListItemSecondaryAction>
                        <Tooltip title="Promouvoir en administrateur">
                          <IconButton
                            edge="end"
                            onClick={() => handlePromoteToAdmin(member.id)}
                            sx={{ mr: 1 }}
                          >
                            <AdminIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Retirer du groupe">
                          <IconButton
                            edge="end"
                            onClick={() => handleRemoveMember(member.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </ListItemSecondaryAction>
                    )}
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))
          )}
        </List>
      </Paper>
      
      {/* Dialogue d'invitation */}
      <Dialog
        open={inviteDialog}
        onClose={handleCloseInviteDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Inviter des membres</DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            Partagez ce lien ou ce code d'accès avec les personnes que vous souhaitez inviter à rejoindre ce groupe.
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Lien d'invitation:
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              value={`${window.location.origin}/discussion-groups/join/${groupId}`}
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <IconButton
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/discussion-groups/join/${groupId}`);
                      setNotification({
                        open: true,
                        message: 'Lien d\'invitation copié dans le presse-papiers',
                        severity: 'success'
                      });
                    }}
                  >
                    <CopyIcon />
                  </IconButton>
                ),
              }}
            />
          </Box>
          
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Code d'accès:
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              value={accessCode}
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <IconButton onClick={handleCopyAccessCode}>
                    <CopyIcon />
                  </IconButton>
                ),
              }}
            />
            <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
              Les utilisateurs auront besoin de ce code pour rejoindre le groupe s'il est privé.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInviteDialog}>Fermer</Button>
        </DialogActions>
      </Dialog>
      
      {/* Dialogue de confirmation */}
      <Dialog
        open={confirmDialog.open}
        onClose={handleCloseConfirmDialog}
      >
        <DialogTitle>{confirmDialog.title}</DialogTitle>
        <DialogContent>
          <Typography>{confirmDialog.message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog}>Annuler</Button>
          <Button onClick={handleConfirmAction} color="primary" autoFocus>
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default GroupMembersList;
