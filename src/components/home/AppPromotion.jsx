import React from 'react';
import { Smartphone, QrCode, Download } from 'lucide-react';
import PageContainer from '../layout/PageContainer';
import Button from '../common/Button';

export const AppPromotion = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-rose-600 via-rose-700 to-orange-600 text-white overflow-hidden">
      <PageContainer>
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
          <div className="space-y-4 text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-1 text-xs font-bold backdrop-blur-md">
              <Smartphone size={14} /> Download Mobile App
            </span>
            <h2 className="text-3xl font-extrabold sm:text-4xl">Order Faster with UrbanBite App</h2>
            <p className="max-w-md text-xs sm:text-sm text-white/80 leading-relaxed mx-auto lg:mx-0">
              Get live GPS order tracking, instant app-exclusive deals, quick re-ordering, and 1-tap checkout.
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <Button variant="amber" size="md" className="gap-2">
                <Download size={16} /> App Store
              </Button>
              <Button variant="secondary" size="md" className="gap-2 bg-slate-900 text-white hover:bg-slate-950">
                <Download size={16} /> Google Play
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-center lg:justify-end gap-6">
            <div className="hidden sm:flex flex-col items-center rounded-3xl bg-white/10 p-6 backdrop-blur-md border border-white/20 text-center">
              <QrCode size={120} className="text-white mb-2" />
              <span className="text-[11px] font-bold">Scan to Download</span>
            </div>
            <img
              src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=400&q=80"
              alt="Mobile App"
              className="h-72 rounded-3xl object-cover shadow-2xl border-4 border-white/20"
            />
          </div>
        </div>
      </PageContainer>
    </section>
  );
};

export default AppPromotion;
