import { FileText, Download, Eye, Gavel } from 'lucide-react';

interface Document {
    id: number;
    name: string;
    fileName: string;
}

const documents: Document[] = [
    { id: 1, name: 'Mesafeli Satış Sözleşmesi', fileName: 'demiray Mesafeli Satış Sözleşmesi.docx' },
    { id: 2, name: 'Kargo ve Teslimat', fileName: 'demiray Kargo ve Teslimat.docx' },
    { id: 3, name: 'Kullanım Koşulları', fileName: 'demiray Üyelik ve Kullanım Şartları.docx' },
    { id: 4, name: 'İptal ve İade Koşulları', fileName: 'demiray İptal ve İade Şartları.docx' },
    { id: 5, name: 'Gizlilik Politikası', fileName: 'demiray Gizlilik Politikası.docx' },
];

const Documents = () => {
    // Sayfa içi kaydırma (smooth scroll) için yardımcı fonksiyon
    const scrollToDoc = (id: number) => {
        const element = document.getElementById(`view-${id}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto">
                {/* Üst Kısım: Başlık ve İndirme Kartları */}
                <div className="flex items-center gap-3 mb-8 border-b pb-4">
                    <Gavel className="text-blue-600" size={32} />
                    <h2 className="text-2xl font-bold text-gray-800">Hukuki Belgeler ve Sözleşmeler</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
                    {documents.map((doc) => (
                        <div
                            key={doc.id}
                            className="group flex items-center justify-between p-5 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:border-blue-200"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-700">{doc.name}</h3>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider italic">DOCX Belgesi</p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <a
                                    href={`/${doc.fileName}`}
                                    download
                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                    title="İndir"
                                >
                                    <Download size={20} />
                                </a>
                                <button
                                    onClick={() => scrollToDoc(doc.id)}
                                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
                                    title="Aşağıda Görüntüle"
                                >
                                    <Eye size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Alt Kısım: Belge Görüntüleme Alanı */}
                <div className="space-y-12">
                    <h3 className="text-xl font-semibold text-gray-600 flex items-center gap-2">
                        <Eye size={24} /> Belge İçerikleri
                    </h3>

                    {documents.map((doc) => (
                        <div key={doc.id} id={`view-${doc.id}`} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
                            <div className="bg-gray-100 p-4 border-b flex justify-between items-center">
                                <span className="font-bold text-gray-700">{doc.name}</span>
                                <span className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-500 uppercase tracking-tighter italic">Önizleme Modu</span>
                            </div>

                            <div className="w-full aspect-[1/1.4] relative bg-white">
                                <iframe
                                    src={`https://docs.google.com/gview?url=${window.location.origin}/${encodeURIComponent(doc.fileName)}&embedded=true`}
                                    className="w-full h-full border-none"
                                    title={doc.name}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <p className="mt-8 text-sm text-center text-gray-500 italic">
                    * Yukarıdaki belgeler en son 2024 mevzuatına uygun olarak güncellenmiştir.
                </p>
            </div>
        </div>
    );
};

export default Documents;
