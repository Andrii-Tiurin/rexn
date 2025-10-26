import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

export default function EmailTemplates({ open, onClose, templates }) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-900/60 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-6">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative w-full max-w-3xl transform overflow-hidden rounded-xl bg-white px-6 pb-6 pt-5 text-left shadow-xl transition-all dark:bg-slate-900">
                <div className="flex items-start justify-between">
                  <Dialog.Title className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    E-Mail-Vorlagen
                  </Dialog.Title>
                  <button
                    type="button"
                    className="rounded-md border border-slate-200 px-2 py-1 text-sm text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    onClick={onClose}
                  >
                    Schließen
                  </button>
                </div>
                <div className="mt-4 space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">SEPA (Deutschland)</h3>
                    <textarea
                      readOnly
                      rows={10}
                      className="mt-2 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                      value={templates.sepa}
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">SWIFT (International)</h3>
                    <textarea
                      readOnly
                      rows={10}
                      className="mt-2 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                      value={templates.swift}
                    />
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
