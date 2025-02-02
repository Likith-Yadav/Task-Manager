import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  DocumentData,
  setDoc
} from 'firebase/firestore';
import { db } from './firebase';
import type { User, Task, Project, Category, TaskCategory } from './models';

// Generic function to convert Firestore timestamp to Date
const convertTimestamps = (data: DocumentData) => {
  const result = { ...data };
  for (const [key, value] of Object.entries(data)) {
    if (value instanceof Timestamp) {
      result[key] = value.toDate();
    }
  }
  return result;
};

export const convertToTimestamp = (date: Date) => {
  return Timestamp.fromDate(date);
};

// Users
export const createUser = async (userId: string, userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> => {
  const now = new Date();
  const userDoc = doc(db, 'users', userId);
  await setDoc(userDoc, {
    ...userData,
    createdAt: now,
    updatedAt: now,
  });
  
  return {
    id: userId,
    ...userData,
    createdAt: now,
    updatedAt: now,
  };
};

export const getUser = async (userId: string): Promise<User | null> => {
  const userDoc = await getDoc(doc(db, 'users', userId));
  if (!userDoc.exists()) return null;
  const data = userDoc.data();
  return {
    id: userDoc.id,
    ...convertTimestamps(data),
  } as User;
};

// Tasks
const TASKS_COLLECTION = 'tasks';

export const createTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
  const now = Timestamp.now();
  const taskDataWithTimestamps = {
    ...taskData,
    dueDate: taskData.dueDate instanceof Date ? Timestamp.fromDate(taskData.dueDate) : taskData.dueDate,
    createdAt: now,
    updatedAt: now,
  };

  const docRef = await addDoc(collection(db, TASKS_COLLECTION), taskDataWithTimestamps);
  const newTask = await getDoc(docRef);
  
  if (!newTask.exists()) {
    throw new Error('Failed to create task');
  }

  const data = newTask.data();
  return {
    id: newTask.id,
    ...data,
    createdAt: data.createdAt as Timestamp,
    updatedAt: data.updatedAt as Timestamp,
    dueDate: data.dueDate as Timestamp | undefined,
  } as Task;
};

export const getTask = async (taskId: string): Promise<Task | null> => {
  const taskDoc = await getDoc(doc(db, 'tasks', taskId));
  if (!taskDoc.exists()) return null;
  const data = taskDoc.data();
  return {
    id: taskDoc.id,
    ...data,
    createdAt: data.createdAt as Timestamp,
    updatedAt: data.updatedAt as Timestamp,
    dueDate: data.dueDate as Timestamp | undefined,
  } as Task;
};

export const updateTask = async (taskId: string, updates: Partial<Task>): Promise<Task> => {
  const taskRef = doc(db, TASKS_COLLECTION, taskId);
  const updateData = {
    ...updates,
    dueDate: updates.dueDate instanceof Date ? Timestamp.fromDate(updates.dueDate) : updates.dueDate,
    updatedAt: Timestamp.now(),
  };

  await updateDoc(taskRef, updateData);
  const updatedTask = await getDoc(taskRef);
  
  if (!updatedTask.exists()) {
    throw new Error('Task not found');
  }

  const data = updatedTask.data();
  return {
    id: updatedTask.id,
    ...data,
    createdAt: data.createdAt as Timestamp,
    updatedAt: data.updatedAt as Timestamp,
    dueDate: data.dueDate as Timestamp | undefined,
  } as Task;
};

export const deleteTask = async (taskId: string): Promise<void> => {
  const taskRef = doc(db, TASKS_COLLECTION, taskId);
  await deleteDoc(taskRef);
};

export const getUserTasks = async (userId: string): Promise<Task[]> => {
  try {
    const tasksQuery = query(
      collection(db, TASKS_COLLECTION),
      where('userId', '==', userId)
    );
    
    const snapshot = await getDocs(tasksQuery);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt as Timestamp,
        updatedAt: data.updatedAt as Timestamp,
        dueDate: data.dueDate as Timestamp | undefined,
      } as Task;
    }).sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

// Projects
const PROJECTS_COLLECTION = 'projects';

export async function createProject(
  projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Project> {
  const now = Timestamp.now();
  const projectRef = collection(db, PROJECTS_COLLECTION);
  const newProject = {
    ...projectData,
    createdAt: now,
    updatedAt: now,
  };
  
  const docRef = await addDoc(projectRef, newProject);
  return {
    id: docRef.id,
    ...newProject
  };
}

export async function getProject(projectId: string): Promise<Project | null> {
  const docRef = doc(db, PROJECTS_COLLECTION, projectId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Project : null;
}

export async function getUserProjects(userId: string): Promise<Project[]> {
  const projectsRef = collection(db, PROJECTS_COLLECTION);
  const q = query(
    projectsRef,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  const projects: Project[] = [];
  querySnapshot.forEach((doc) => {
    projects.push({ id: doc.id, ...doc.data() } as Project);
  });
  
  return projects;
}

export async function updateProject(
  projectId: string,
  updates: Partial<Omit<Project, 'id' | 'createdAt'>>
): Promise<Project> {
  const projectRef = doc(db, PROJECTS_COLLECTION, projectId);
  const updateData = {
    ...updates,
    updatedAt: Timestamp.now()
  };
  
  await updateDoc(projectRef, updateData);
  const updatedDoc = await getDoc(projectRef);
  
  if (!updatedDoc.exists()) {
    throw new Error('Project not found');
  }
  
  return { id: updatedDoc.id, ...updatedDoc.data() } as Project;
}

export async function deleteProject(projectId: string): Promise<void> {
  const projectRef = doc(db, PROJECTS_COLLECTION, projectId);
  await deleteDoc(projectRef);
}

// Categories
const CATEGORIES_COLLECTION = 'categories';

export const createCategory = async (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> => {
  const categoryRef = await addDoc(collection(db, CATEGORIES_COLLECTION), {
    ...categoryData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  const newCategory = await getDoc(categoryRef);
  if (!newCategory.exists()) {
    throw new Error('Failed to create category');
  }
  return { id: newCategory.id, ...convertTimestamps(newCategory.data()) } as Category;
};

export const fetchCategories = async (userId: string): Promise<Category[]> => {
  try {
    const categoriesQuery = query(
      collection(db, CATEGORIES_COLLECTION),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(categoriesQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Category[];
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const getUserCategories = async (userId: string): Promise<Category[]> => {
  const q = query(
    collection(db, CATEGORIES_COLLECTION),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...convertTimestamps(doc.data()),
  })) as Category[];
};

// Task Categories
export const addTaskCategory = async (taskCategory: TaskCategory): Promise<void> => {
  await addDoc(collection(db, 'taskCategories'), taskCategory);
};

export const getTaskCategories = async (taskId: string): Promise<TaskCategory[]> => {
  const q = query(collection(db, 'taskCategories'), where('taskId', '==', taskId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as TaskCategory);
};

import {
  GoogleAuthProvider,
  signInWithPopup,
  UserCredential,
} from 'firebase/auth';
import { auth } from './firebase';

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async (): Promise<UserCredential> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // Create or update user in Firestore
    const userDoc = doc(db, 'users', result.user.uid);
    const userSnapshot = await getDoc(userDoc);
    
    if (!userSnapshot.exists()) {
      const userData: User = {
        id: result.user.uid,
        email: result.user.email!,
        name: result.user.displayName || 'User',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await setDoc(userDoc, userData);
    }
    
    return result;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

export const getUserAuth = async (userId: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data() as User;
    }
    return null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

export const createUserAuth = async (userData: User): Promise<void> => {
  try {
    await setDoc(doc(db, 'users', userData.id), userData);
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};
