'use client';
// src/app/(customer)/pc-builder/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { usePCBuilderStore } from '@/store/pcBuilderStore';
import { useCartStore } from '@/store/cartStore';
import { getAuthToken } from '@/lib/api';
import { pcBuilderService } from '@/lib/services/pcBuilderService';
import { formatPrice } from '@/lib/utils';
import { notify } from '@/components/ui/toast';
import { FeedbackMessage } from '@/components/ui/feedback-message';
import {
  Trash2, ShoppingCart, 
  Download, Plus, AlertTriangle, CheckCircle
} from 'lucide-react';
import * as Icons from 'lucide-react';

function downloadBuildPdf(buildName: string, components: { label: string; name: string; price: number }[], total: number) {
  const safeText = (value: string) => value.normalize('NFKD').replace(/[^\x20-\x7E]/g, '').replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
  const money = (value: number) => `BDT ${Math.round(value).toLocaleString('en-US')}`;
  const pageWidth = 595;
  const pageHeight = 842;
  const navy = '0.06 0.10 0.19';
  const blue = '0.12 0.36 0.96';
  const slate = '0.34 0.39 0.48';
  const light = '0.95 0.96 0.98';
  const escape = (value: string) => `(${safeText(value)})`;
  const text = (commands: string[], value: string, x: number, y: number, size = 10, font = 'F1', color = '0.10 0.14 0.22') => {
    commands.push(`${color} rg BT /${font} ${size} Tf ${x} ${y} Td ${escape(value)} Tj ET`);
  };
  const rect = (commands: string[], x: number, y: number, width: number, height: number, color: string) => {
    commands.push(`${color} rg ${x} ${y} ${width} ${height} re f`);
  };
  const wrapText = (value: string, maxLength: number) => {
    const words = safeText(value).split(/\s+/);
    const lines: string[] = [];
    let line = '';
    for (const word of words) {
      if (line && `${line} ${word}`.length > maxLength) { lines.push(line); line = word; }
      else line = line ? `${line} ${word}` : word;
    }
    if (line) lines.push(line);
    return lines.slice(0, 2);
  };
  const rowsPerPage = 12;
  const chunks: typeof components[] = [];
  for (let i = 0; i < components.length; i += rowsPerPage) chunks.push(components.slice(i, i + rowsPerPage));
  const pages = chunks.map((rows, pageIndex) => {
    const commands: string[] = [];
    rect(commands, 0, 700, pageWidth, 142, navy);
    rect(commands, 0, 700, 7, 142, blue);
    text(commands, 'NEXUS', 40, 795, 22, 'F2', '1 1 1');
    text(commands, 'PC', 112, 795, 22, 'F2', '0.38 0.62 1');
    text(commands, 'CUSTOM PC BUILD', 40, 770, 9, 'F2', '0.75 0.80 0.90');
    text(commands, safeText(buildName.trim() || 'My Custom Build').slice(0, 58), 40, 733, 20, 'F2', '1 1 1');
    text(commands, `Prepared ${new Date().toLocaleDateString('en-GB')}  |  ${components.length} selected components`, 40, 714, 9, 'F1', '0.75 0.80 0.90');

    text(commands, pageIndex === 0 ? 'COMPONENT SUMMARY' : 'COMPONENT SUMMARY (CONTINUED)', 40, 674, 10, 'F2', navy);
    const tableTop = 652;
    rect(commands, 40, tableTop - 26, 515, 26, blue);
    text(commands, '#', 50, tableTop - 17, 8, 'F2', '1 1 1');
    text(commands, 'COMPONENT / PRODUCT', 76, tableTop - 17, 8, 'F2', '1 1 1');
    text(commands, 'QTY', 416, tableTop - 17, 8, 'F2', '1 1 1');
    text(commands, 'UNIT PRICE', 454, tableTop - 17, 8, 'F2', '1 1 1');
    text(commands, 'TOTAL', 514, tableTop - 17, 8, 'F2', '1 1 1');
    let y = tableTop - 26;
    rows.forEach((component, index) => {
      const rowHeight = 38;
      y -= rowHeight;
      if (index % 2 === 0) rect(commands, 40, y, 515, rowHeight, light);
      text(commands, String(pageIndex * rowsPerPage + index + 1).padStart(2, '0'), 50, y + 22, 9, 'F2', slate);
      text(commands, component.label.toUpperCase().slice(0, 24), 76, y + 22, 7, 'F2', blue);
      wrapText(component.name, 48).forEach((line, lineIndex) => text(commands, line, 76, y + 9 - lineIndex * 10, 8, 'F1'));
      text(commands, '1', 421, y + 16, 9, 'F1', slate);
      text(commands, money(component.price), 452, y + 16, 8, 'F1', slate);
      text(commands, money(component.price), 510, y + 16, 8, 'F2');
      commands.push(`0.84 0.87 0.91 RG 0.5 w 40 ${y} m 555 ${y} l S`);
    });
    y -= 18;
    if (pageIndex === chunks.length - 1) {
      rect(commands, 40, y - 58, 515, 58, navy);
      text(commands, 'ESTIMATED BUILD TOTAL', 58, y - 25, 9, 'F2', '0.75 0.80 0.90');
      text(commands, money(total), 58, y - 47, 18, 'F2', '1 1 1');
      text(commands, 'Prices are estimates and may change. Confirm availability before ordering.', 40, 58, 8, 'F1', slate);
    }
    text(commands, 'NEXUSPC  |  BUILD YOUR DREAM', 40, 34, 8, 'F2', blue);
    text(commands, `PAGE ${pageIndex + 1} OF ${chunks.length}`, 493, 34, 8, 'F1', slate);
    return commands.join('\n');
  });

  const objects: string[] = [];
  const addObject = (body: string) => { objects.push(body); return objects.length; };
  const catalogId = addObject('');
  const pagesId = addObject('');
  const regularFontId = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
  const boldFontId = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>');
  const pageIds = pages.map((stream) => {
    const contentId = addObject(`<< /Length ${new TextEncoder().encode(stream).length} >>\nstream\n${stream}\nendstream`);
    return addObject(`<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 ${regularFontId} 0 R /F2 ${boldFontId} 0 R >> >> /Contents ${contentId} 0 R >>`);
  });
  objects[catalogId - 1] = `<< /Type /Catalog /Pages ${pagesId} 0 R >>`;
  objects[pagesId - 1] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pageIds.length} >>`;
  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(new TextEncoder().encode(pdf).length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefOffset = new TextEncoder().encode(pdf).length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => { pdf += `${String(offset).padStart(10, '0')} 00000 n \n`; });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  const blob = new Blob([pdf], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${(buildName || 'nexuspc-build').trim().replace(/[^a-z0-9-_]+/gi, '-').toLowerCase() || 'nexuspc-build'}.pdf`;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function PCBuilderPage() {
  const { slots, buildName, setBuildName, removeComponent, getTotalPrice, getWarnings, isComplete } = usePCBuilderStore();
  const addItemToCart = useCartStore(state => state.addItem);
  const openCart = useCartStore(state => state.openCart);
  const [isSaving, setIsSaving] = useState(false);

  const warnings = getWarnings();
  const total = getTotalPrice();
  const completed = isComplete();

  const handleAddAllToCart = () => {
    const selectedSlots = slots.filter((slot) => slot.selectedComponent);
    if (selectedSlots.length === 0) {
      notify.info('Choose components before adding a build to your cart.');
      return;
    }
    slots.forEach(slot => {
      if (slot.selectedComponent) {
        addItemToCart({
          productId: slot.selectedComponent.id,
          slug: slot.selectedComponent.slug,
          name: slot.selectedComponent.name,
          brand: slot.selectedComponent.brand,
          image: slot.selectedComponent.image,
          price: slot.selectedComponent.price,
          quantity: 1,
          stockCount: 1,
          categoryName: slot.categorySlug,
        });
      }
    });
    openCart();
    notify.success('Build added to cart', `${selectedSlots.length} components added.`);
  };

  const handleSaveBuild = async () => {
    if (!getAuthToken()) {
      notify.info('Sign in to save your build.');
      return;
    }
    if (!completed || warnings.some((warning) => warning.severity === 'error')) {
      notify.error('Complete the build and resolve compatibility issues before saving.');
      return;
    }
    setIsSaving(true);
    try {
      const components = Object.fromEntries(
        slots.filter((slot) => slot.selectedComponent)
          .map((slot) => [slot.key, Number(slot.selectedComponent!.id)]),
      );
      await pcBuilderService.save(buildName.trim() || 'My Custom Build', components);
      notify.success('Build saved to your account.');
    } catch {
      notify.error('Unable to save this build. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadBuild = () => {
    const components = slots.filter((slot) => slot.selectedComponent).map((slot) => ({
      label: slot.label,
      name: slot.selectedComponent!.name,
      price: slot.selectedComponent!.price,
    }));
    if (components.length === 0) {
      notify.info('Choose components before downloading your build.');
      return;
    }
    downloadBuildPdf(buildName, components, total);
    notify.success('Build list downloaded as PDF.');
  };

  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as unknown as Record<string, React.ElementType>)[iconName] || Icons.Box;
    return <IconComponent size={24} className="text-gray-400" />;
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8 pb-32 lg:pb-10">
      <div className="container-site max-w-5xl">
        
        {/* Header Section */}
        <div className="bg-slate-900 rounded-t-xl p-6 md:p-8 text-white flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold mb-2">PC Builder</h1>
            <p className="text-slate-400 text-sm max-w-xl">Build your dream PC component by component. We&apos;ll automatically check for compatibility issues between major parts.</p>
          </div>
          
          <div className="bg-slate-800 p-4 rounded-lg flex-shrink-0 min-w-[200px]">
            <p className="text-slate-400 text-xs uppercase tracking-wider font-bold mb-1">Estimated Total</p>
            <p className="text-3xl font-extrabold text-blue-400">{formatPrice(total)}</p>
            <p className="text-xs text-slate-500 mt-1">{slots.filter(s => s.selectedComponent).length} Items Selected</p>
          </div>
        </div>

        {/* Name and Actions */}
        <div className="bg-white border-x border-b border-gray-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm relative z-10">
          <div className="flex-1 w-full relative">
            <input 
              type="text" 
              value={buildName}
              onChange={(e) => setBuildName(e.target.value)}
              className="w-full text-lg font-bold text-gray-900 border-b-2 border-transparent hover:border-gray-200 focus:border-blue-600 focus:outline-none transition-colors py-1 bg-transparent pr-8"
              placeholder="Name your build..."
            />
            <Icons.Edit2 size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <button type="button" onClick={handleSaveBuild} disabled={isSaving} className="flex-1 sm:flex-none px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 text-sm font-medium transition-colors">
              {isSaving ? 'Saving...' : 'Save Build'}
            </button>
            <button type="button" onClick={handleDownloadBuild} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 rounded-md hover:bg-gray-50 text-sm font-medium transition-colors">
              <Download size={16} /> Download Build
            </button>
          </div>
        </div>

        {/* Warnings */}
        {warnings.length > 0 && (
          <div className="mt-6 space-y-2">
            {warnings.map((warning, idx) => (
              warning.severity === 'error' ? (
                <FeedbackMessage key={idx} title="Compatibility issue">
                  {warning.message}
                </FeedbackMessage>
              ) : (
                <div key={idx} className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900">
                  <AlertTriangle size={20} className="mt-0.5 shrink-0 text-amber-600" />
                  <div>
                    <p className="mb-1 text-sm font-semibold">Compatibility warning</p>
                    <p className="text-sm">{warning.message}</p>
                  </div>
                </div>
              )
            ))}
          </div>
        )}
        
        {/* Success message if completed without errors */}
        {completed && warnings.filter(w => w.severity === 'error').length === 0 && (
          <div className="mt-6 p-4 rounded-lg flex gap-3 border bg-green-50 border-green-200 text-green-800">
            <CheckCircle size={20} className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm mb-1">Build Complete & Compatible</p>
              <p className="text-sm opacity-90">All required components are selected and appear compatible. You&apos;re ready to order!</p>
            </div>
          </div>
        )}

        {/* Builder Slots */}
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header Row */}
          <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
            <div className="col-span-2">Component</div>
            <div className="col-span-6">Selection</div>
            <div className="col-span-2 text-right">Price</div>
            <div className="col-span-2 text-right">Action</div>
          </div>

          <div className="divide-y divide-gray-100">
            {slots.map((slot) => {
              const component = slot.selectedComponent;
              
              return (
                <div key={slot.key} className={`p-4 md:grid md:grid-cols-12 gap-4 items-center flex flex-col relative transition-colors ${!component ? 'bg-white hover:bg-slate-50' : 'bg-white'}`}>
                  
                  {/* Slot Label */}
                  <div className="col-span-2 flex items-center gap-3 w-full">
                    <div className="w-10 h-10 rounded-md bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0">
                      {getIcon(slot.icon)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm leading-tight">{slot.label}</p>
                      {!slot.required && <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Optional</span>}
                    </div>
                  </div>

                  {/* Component Info */}
                  <div className="col-span-6 flex items-center w-full mt-3 md:mt-0">
                    {component ? (
                      <div className="flex gap-4 items-center w-full">
                        <div className="w-16 h-16 relative bg-white border border-gray-100 rounded-md p-1 flex-shrink-0">
                          <Image src={component.image} alt={component.name} fill className="object-contain mix-blend-multiply" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link href={`/products/${slot.categorySlug}/${component.slug}`} className="font-medium text-sm text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors">
                            {component.name}
                          </Link>
                          {/* Display one key spec */}
                          <p className="text-xs text-gray-500 mt-1 truncate">
                            {component.specifications[0]?.label}: {component.specifications[0]?.value}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full flex items-center">
                        <Link href={`/pc-builder/choose/${slot.key}`} className="w-full md:w-auto flex-1 btn-outline border-dashed text-gray-500 border-gray-300 hover:text-blue-600 hover:border-blue-600 hover:bg-blue-50 py-2.5 justify-center">
                          <Plus size={16} /> Choose {slot.label}
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Price */}
                  <div className="col-span-2 text-right w-full md:w-auto mt-3 md:mt-0 flex justify-between md:block">
                    <span className="md:hidden text-sm font-medium text-gray-500">Price:</span>
                    <span className="font-bold text-gray-900">
                      {component ? formatPrice(component.price) : '-'}
                    </span>
                  </div>

                  {/* Action */}
                  <div className="col-span-2 text-right w-full md:w-auto mt-3 md:mt-0">
                    {component && (
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/pc-builder/choose/${slot.key}`} className="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 rounded transition-colors">
                          Change
                        </Link>
                        <button 
                          onClick={() => { removeComponent(slot.key); notify.success('Component removed from your build.'); }}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                          aria-label="Remove component"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions (Sticky on Mobile) */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)] z-40 md:relative md:bg-transparent md:border-0 md:p-0 md:shadow-none md:mt-8 md:flex md:justify-end">
          <div className="container-site px-0 flex items-center justify-between gap-4">
            <div className="md:hidden">
              <p className="text-xs text-gray-500 font-bold uppercase">Total</p>
              <p className="text-xl font-extrabold text-blue-700">{formatPrice(total)}</p>
            </div>
            
            <button 
              onClick={handleAddAllToCart}
              disabled={slots.filter(s => s.selectedComponent).length === 0}
              className="btn-primary py-3 px-8 text-base shadow-sm w-full md:w-auto justify-center disabled:opacity-50"
            >
              <ShoppingCart size={18} />
              Add All to Cart
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
