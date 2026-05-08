import { Request, Response } from 'express';
import * as dbService from '../services/db.service';

// Simple mock for token (since we don't have jsonwebtoken yet)
const generateToken = (user: any) => {
    return Buffer.from(JSON.stringify({ id: user.id, email: user.email, name: user.name })).toString('base64');
};

const decodeToken = (token: string) => {
    try {
        return JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
    } catch (e) {
        return null;
    }
};

export const register = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const existingUser = await dbService.findUserByEmail(email);
    if (existingUser) {
        return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password, // In a real app, hash this!
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
        createdAt: Date.now()
    };

    await dbService.saveUser(newUser);

    const token = generateToken(newUser);
    res.status(201).json({ user: { id: newUser.id, name: newUser.name, email: newUser.email, avatar: newUser.avatar }, token });
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await dbService.findUserByEmail(email);
    if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = generateToken(user);
    res.json({ user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar }, token });
};

export const getMe = async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No autorizado' });

    const token = authHeader.split(' ')[1];
    const decoded = decodeToken(token);

    if (!decoded) return res.status(401).json({ message: 'Token inválido' });

    const user = await dbService.findUserByEmail(decoded.email);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    res.json({ user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar } });
};

export const updateProfile = async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No autorizado' });

    const token = authHeader.split(' ')[1];
    const decoded = decodeToken(token);
    if (!decoded) return res.status(401).json({ message: 'Token inválido' });

    const { name, email, password, avatar } = req.body;
    
    // Si cambia el email, verificar que no exista
    if (email && email !== decoded.email) {
        const existing = await dbService.findUserByEmail(email);
        if (existing) return res.status(400).json({ message: 'El email ya está en uso' });
    }

    const updates: any = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (password) updates.password = password;
    if (avatar) updates.avatar = avatar;

    await dbService.updateUser(decoded.id, updates);
    
    // Obtener usuario actualizado
    const updatedUser = await dbService.findUserByEmail(email || decoded.email);
    
    res.json({ 
        message: 'Perfil actualizado', 
        user: { 
            id: updatedUser.id, 
            name: updatedUser.name, 
            email: updatedUser.email, 
            avatar: updatedUser.avatar 
        } 
    });
};
