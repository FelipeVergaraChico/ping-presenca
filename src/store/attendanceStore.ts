import { create } from 'zustand';
import type { AttendanceState, Class, Course } from '../types';
import api from "../hooks/useAPI";

export const useAttendanceStore = create<
  AttendanceState & {
    fetchCourses: () => Promise<void>;
    selectCourse: (course: Course) => void;
    fetchClasses: (courseId: string) => Promise<void>;
    selectClass: (classItem: Class) => void;
    markAttendance: (code: string) => Promise<boolean>;
    generateAttendanceCode: () => Promise<string | null>;
    clearAttendanceCode: () => Promise<void>;
    fetchStudents: (classId: string) => Promise<void>;
  }
>((set, get) => ({
  activeCourses: [],
  selectedCourse: null,
  classes: [],
  selectedClass: null,
  attendances: [],
  students: [],
  isLoading: false,
  error: null,

  fetchCourses: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get("/courses");
      set({ activeCourses: response.data, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  selectCourse: (course) => {
    set({ selectedCourse: course });
  },

  fetchClasses: async (courseId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/courses/${courseId}/classes`);
      set({ classes: response.data, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  selectClass: (classItem) => {
    set({ selectedClass: classItem });
  },

  markAttendance: async (code) => {
    set({ isLoading: true, error: null });
    try {
      // Simulação de API (na implementação real, conecte com o backend)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const { selectedClass } = get();

      if (!selectedClass || !selectedClass.attendanceCode) {
        throw new Error("Nenhuma chamada ativa no momento.");
      }

      if (selectedClass.attendanceCode !== code) {
        throw new Error("Código inválido.");
      }

      // Simula um registro de presença bem-sucedido
      set({ isLoading: false });
      return true;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      return false;
    }
  },

  generateAttendanceCode: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulação de API (na implementação real, conecte com o backend)
      await new Promise((resolve) => setTimeout(resolve, 500));

      const { selectedClass } = get();

      if (!selectedClass) {
        throw new Error("Nenhuma aula selecionada.");
      }

      // Gera um código aleatório de 6 dígitos
      const code = Math.floor(100000 + Math.random() * 900000).toString();

      // Define quando o código irá expirar (30 segundos a partir de agora)
      const expiresAt = new Date(Date.now() + 30000).toISOString();

      // Atualiza a classe selecionada com o novo código
      const updatedClass: Class = {
        ...selectedClass,
        isAttendanceActive: true,
        attendanceCode: code,
        codeExpiresAt: expiresAt,
      };

      // Atualiza a lista de classes com a classe atualizada
      const updatedClasses = get().classes.map((c) =>
        c.id === updatedClass.id ? updatedClass : c
      );

      set({
        selectedClass: updatedClass,
        classes: updatedClasses,
        isLoading: false,
      });

      return code;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      return null;
    }
  },

  clearAttendanceCode: async () => {
    const { selectedClass } = get();

    if (!selectedClass) {
      return;
    }

    // Atualiza a classe selecionada removendo o código
    const updatedClass: Class = {
      ...selectedClass,
      isAttendanceActive: false,
      attendanceCode: undefined,
      codeExpiresAt: undefined,
    };

    // Atualiza a lista de classes com a classe atualizada
    const updatedClasses = get().classes.map((c) =>
      c.id === updatedClass.id ? updatedClass : c
    );

    set({
      selectedClass: updatedClass,
      classes: updatedClasses,
    });
  },

  fetchStudents: async (classId: string) => {
    set({ isLoading: true, error: null });
    try {
      // Simulação de API (na implementação real, conecte com o backend)
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Usar classId para filtrar estudantes específicos da aula (mockado)
      const mockStudents = [
        {
          id: "1",
          name: "Ana Silva",
          email: "ana@exemplo.com",
          enrollment: "2023001",
        },
        {
          id: "2",
          name: "Carlos Santos",
          email: "carlos@exemplo.com",
          enrollment: "2023002",
        },
        {
          id: "3",
          name: "Maria Oliveira",
          email: "maria@exemplo.com",
          enrollment: "2023003",
        },
        {
          id: "4",
          name: "João Costa",
          email: "joao@exemplo.com",
          enrollment: "2023004",
        },
        {
          id: "5",
          name: "Lucia Pereira",
          email: "lucia@exemplo.com",
          enrollment: "2023005",
        },
        {
          id: "6",
          name: "Pedro Almeida",
          email: "pedro@exemplo.com",
          enrollment: "2023006",
        },
        {
          id: "7",
          name: "Fernanda Lima",
          email: "fernanda@exemplo.com",
          enrollment: "2023007",
        },
        {
          id: "8",
          name: "Rafael Santos",
          email: "rafael@exemplo.com",
          enrollment: "2023008",
        },
      ].filter((_, index) => (classId === "1" ? index < 5 : index >= 3)); // Simular diferentes turmas

      set({ students: mockStudents, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
}));
