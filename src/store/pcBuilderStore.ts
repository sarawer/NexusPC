'use client';
// src/store/pcBuilderStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PCBuildSlot, CompatibilityWarning, PCBuildComponent } from '@/types/pc-builder';

const DEFAULT_SLOTS: PCBuildSlot[] = [
  { key: 'cpu', label: 'Processor (CPU)', required: true, categorySlug: 'cpu', icon: 'Cpu' },
  { key: 'cpu-cooler', label: 'CPU Cooler', required: false, categorySlug: 'cpu-cooler', icon: 'Wind' },
  { key: 'motherboard', label: 'Motherboard', required: true, categorySlug: 'motherboard', icon: 'CircuitBoard' },
  { key: 'ram', label: 'RAM', required: true, categorySlug: 'ram', icon: 'MemoryStick' },
  { key: 'gpu', label: 'Graphics Card (GPU)', required: false, categorySlug: 'gpu', icon: 'Monitor' },
  { key: 'storage', label: 'Storage (SSD/HDD)', required: true, categorySlug: 'ssd', icon: 'HardDrive' },
  { key: 'psu', label: 'Power Supply (PSU)', required: true, categorySlug: 'psu', icon: 'Zap' },
  { key: 'case', label: 'PC Case', required: true, categorySlug: 'case', icon: 'Box' },
];

interface PCBuilderStore {
  slots: PCBuildSlot[];
  buildName: string;
  setComponent: (slotKey: string, component: PCBuildComponent) => void;
  removeComponent: (slotKey: string) => void;
  resetBuild: () => void;
  setBuildName: (name: string) => void;
  getTotalPrice: () => number;
  getWarnings: () => CompatibilityWarning[];
  isComplete: () => boolean;
}

export const usePCBuilderStore = create<PCBuilderStore>()(
  persist(
    (set, get) => ({
      slots: DEFAULT_SLOTS,
      buildName: 'My Custom Build',

      setComponent: (slotKey, component) => {
        set((state) => ({
          slots: state.slots.map((slot) =>
            slot.key === slotKey ? { ...slot, selectedComponent: component } : slot
          ),
        }));
      },

      removeComponent: (slotKey) => {
        set((state) => ({
          slots: state.slots.map((slot) =>
            slot.key === slotKey ? { ...slot, selectedComponent: undefined } : slot
          ),
        }));
      },

      resetBuild: () => {
        set({ slots: DEFAULT_SLOTS, buildName: 'My Custom Build' });
      },

      setBuildName: (name) => set({ buildName: name }),

      getTotalPrice: () => {
        return get().slots.reduce(
          (sum, slot) => sum + (slot.selectedComponent?.price ?? 0),
          0
        );
      },

      getWarnings: (): CompatibilityWarning[] => {
        const warnings: CompatibilityWarning[] = [];
        const slots = get().slots;
        const cpu = slots.find((s) => s.key === 'cpu')?.selectedComponent;
        const motherboard = slots.find((s) => s.key === 'motherboard')?.selectedComponent;
        const gpu = slots.find((s) => s.key === 'gpu')?.selectedComponent;
        const psu = slots.find((s) => s.key === 'psu')?.selectedComponent;

        // Socket compatibility check
        if (cpu && motherboard) {
          const cpuSocket = cpu.specifications.find((s) => s.label === 'Socket')?.value;
          const mbSocket = motherboard.specifications.find((s) => s.label === 'Socket')?.value;
          if (cpuSocket && mbSocket && cpuSocket !== mbSocket) {
            warnings.push({
              severity: 'error',
              message: `CPU socket (${cpuSocket}) is incompatible with motherboard socket (${mbSocket})`,
              affectedSlots: ['cpu', 'motherboard'],
            });
          }
        }

        // PSU wattage check
        if (gpu && psu) {
          const gpuPower = parseInt(
            gpu.specifications.find((s) => s.label === 'Power Consumption')?.value ?? '0'
          );
          const psuWattage = parseInt(
            psu.specifications.find((s) => s.label === 'Wattage')?.value?.replace('W', '') ?? '0'
          );
          if (gpuPower > 0 && psuWattage > 0 && gpuPower + 200 > psuWattage) {
            warnings.push({
              severity: 'warning',
              message: `PSU (${psuWattage}W) may be insufficient for GPU (${gpuPower}W) + system power draw`,
              affectedSlots: ['gpu', 'psu'],
            });
          }
        }

        return warnings;
      },

      isComplete: () => {
        return get()
          .slots.filter((s) => s.required)
          .every((s) => s.selectedComponent !== undefined);
      },
    }),
    {
      name: 'nexuspc-builder',
    }
  )
);
