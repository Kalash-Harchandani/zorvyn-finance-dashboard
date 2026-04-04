import jwt from 'jsonwebtoken';

const generateToken = (id, tenant_id) => {
  return jwt.sign({ id, tenant_id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export default generateToken;
