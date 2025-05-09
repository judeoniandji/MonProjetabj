import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Grid,
  Typography,
  Divider,
  Alert
} from '@mui/material';

const CreateGroupForm = ({ onSubmit, onCancel, topics = [] }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    topic: '',
    is_private: false,
    banner_image_url: '',
    icon_url: '',
    max_members: 500
  });
  
  const [errors, setErrors] = useState({});
  const [newTopic, setNewTopic] = useState('');
  const [showNewTopicField, setShowNewTopicField] = useState(false);

  // Gestionnaire de changement pour les champs du formulaire
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'is_private' ? checked : value
    });
    
    // Effacer l'erreur lorsque l'utilisateur modifie le champ
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // Validation du formulaire
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom du groupe est requis';
    }
    
    if (!formData.topic && !newTopic) {
      newErrors.topic = 'Le sujet du groupe est requis';
    }
    
    if (formData.max_members < 2) {
      newErrors.max_members = 'Le nombre maximum de membres doit être d\'au moins 2';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Gestionnaire de soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Si un nouveau sujet est saisi, l'utiliser à la place du sujet sélectionné
    const finalData = {
      ...formData,
      topic: showNewTopicField && newTopic ? newTopic : formData.topic
    };
    
    onSubmit(finalData);
  };

  // Gestionnaire pour basculer entre sujet existant et nouveau sujet
  const handleToggleNewTopic = () => {
    setShowNewTopicField(!showNewTopicField);
    if (!showNewTopicField) {
      setFormData({
        ...formData,
        topic: ''
      });
    } else {
      setNewTopic('');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            name="name"
            label="Nom du groupe"
            fullWidth
            required
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            name="description"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={formData.description}
            onChange={handleChange}
            placeholder="Décrivez l'objectif de ce groupe de discussion..."
          />
        </Grid>
        
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1" sx={{ mr: 2 }}>
              Sujet du groupe:
            </Typography>
            <Button 
              size="small" 
              onClick={handleToggleNewTopic}
              variant="outlined"
            >
              {showNewTopicField ? 'Choisir un sujet existant' : 'Créer un nouveau sujet'}
            </Button>
          </Box>
          
          {showNewTopicField ? (
            <TextField
              name="newTopic"
              label="Nouveau sujet"
              fullWidth
              required
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              error={!!errors.topic}
              helperText={errors.topic}
            />
          ) : (
            <FormControl fullWidth error={!!errors.topic}>
              <InputLabel id="topic-label">Sujet</InputLabel>
              <Select
                labelId="topic-label"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                label="Sujet"
                required
              >
                {topics.map((topic) => (
                  <MenuItem key={topic} value={topic}>
                    {topic}
                  </MenuItem>
                ))}
              </Select>
              {errors.topic && (
                <Typography variant="caption" color="error">
                  {errors.topic}
                </Typography>
              )}
            </FormControl>
          )}
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            name="banner_image_url"
            label="URL de l'image de bannière"
            fullWidth
            value={formData.banner_image_url}
            onChange={handleChange}
            placeholder="https://example.com/banner.jpg"
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            name="icon_url"
            label="URL de l'icône"
            fullWidth
            value={formData.icon_url}
            onChange={handleChange}
            placeholder="https://example.com/icon.png"
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            name="max_members"
            label="Nombre maximum de membres"
            type="number"
            fullWidth
            value={formData.max_members}
            onChange={handleChange}
            inputProps={{ min: 2, max: 1000 }}
            error={!!errors.max_members}
            helperText={errors.max_members}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Switch
                name="is_private"
                checked={formData.is_private}
                onChange={handleChange}
                color="primary"
              />
            }
            label="Groupe privé (avec code d'accès)"
          />
          {formData.is_private && (
            <Alert severity="info" sx={{ mt: 1 }}>
              Un code d'accès sera généré automatiquement pour ce groupe privé.
            </Alert>
          )}
        </Grid>
      </Grid>
      
      <Divider sx={{ my: 3 }} />
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button onClick={onCancel} variant="outlined">
          Annuler
        </Button>
        <Button type="submit" variant="contained" color="primary">
          Créer le groupe
        </Button>
      </Box>
    </Box>
  );
};

export default CreateGroupForm;
