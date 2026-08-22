import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Input from '../common/Input';
import Select from '../common/Select';
import PasswordInput from './PasswordInput';
import Button from '../common/Button';
import { CITIES } from '../../utils/constants';

export const RegisterForm = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: 'Lahore',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }
    setIsLoading(true);
    setError('');

    try {
      await register(formData);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="rounded-xl bg-rose-50 p-3 text-xs text-rose-600 font-semibold">{error}</div>}

      <Input
        label="Full Name"
        icon={User}
        placeholder="John Doe"
        value={formData.fullName}
        onChange={(e) => handleChange('fullName', e.target.value)}
        required
      />

      <Input
        label="Email Address"
        type="email"
        icon={Mail}
        placeholder="john@example.com"
        value={formData.email}
        onChange={(e) => handleChange('email', e.target.value)}
        required
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Phone Number"
          icon={Phone}
          placeholder="03001234567"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
        />
        <Select
          label="Select City"
          value={formData.city}
          onChange={(e) => handleChange('city', e.target.value)}
          placeholder=""
          options={CITIES.map((c) => ({ value: c.name, label: c.name }))}
        />
      </div>

      <PasswordInput
        label="Create Password"
        value={formData.password}
        onChange={(e) => handleChange('password', e.target.value)}
        required
      />

      <Button type="submit" variant="primary" fullWidth isLoading={isLoading} size="lg" className="gap-2">
        Create UrbanBite Account <ArrowRight size={18} />
      </Button>
    </form>
  );
};

export default RegisterForm;
