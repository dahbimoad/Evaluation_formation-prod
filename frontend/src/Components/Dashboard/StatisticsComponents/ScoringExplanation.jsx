import React, { useState } from 'react';
import { FaQuestionCircle, FaTimes, FaChartBar, FaToggleOn, FaComments, FaCalculator, FaInfoCircle, FaDownload, FaCheckCircle, FaFilePdf } from 'react-icons/fa';

const ScoringExplanation = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadSuccess, setDownloadSuccess] = useState(false);

    if (!isOpen) return null;

    const handleDownloadGuide = async () => {
        try {
            setIsDownloading(true);
            setDownloadSuccess(false);
            
            // Call the backend endpoint
            const response = await fetch(`${import.meta.env.VITE_STATISTICS_API_URL || 'http://localhost:5246/api'}/export/scoring-guide`);

            
            if (!response.ok) {
                throw new Error(`Erreur ${response.status}: ${response.statusText}`);
            }
            
            // Create blob from response
            const blob = await response.blob();
            
            // Create download link
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Guide-Systeme-Evaluation-Formations.pdf';
            document.body.appendChild(a);
            a.click();
            
            // Cleanup
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            // Show success feedback
            setDownloadSuccess(true);
            setTimeout(() => setDownloadSuccess(false), 3000);
            
        } catch (error) {
            console.error('Erreur lors du téléchargement:', error);
            alert('Erreur lors du téléchargement du guide. Veuillez réessayer.');
        } finally {
            setIsDownloading(false);
        }
    };

    const tabs = [
        { id: 'overview', label: 'Vue d\'ensemble', icon: <FaInfoCircle /> },
        { id: 'likert', label: 'Questions Likert', icon: <FaChartBar /> },
        { id: 'binary', label: 'Questions Oui/Non', icon: <FaToggleOn /> },
        { id: 'text', label: 'Questions Texte', icon: <FaComments /> },
        { id: 'calculation', label: 'Calculs Globaux', icon: <FaCalculator /> }
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full h-[90vh] flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex justify-between items-center flex-shrink-0">
                    <div className="flex items-center space-x-3">
                        <FaQuestionCircle className="text-2xl" />
                        <div>
                            <h2 className="text-2xl font-bold">🎯 Guide du Système de Notation</h2>
                            <p className="text-blue-100">Comprendre comment les scores sont calculés</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-gray-200 text-2xl p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all"
                    >
                        <FaTimes />
                    </button>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex-shrink-0">
                    <nav className="flex overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-3 font-medium text-sm flex items-center space-x-2 whitespace-nowrap border-b-2 transition-colors ${
                                    activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-white dark:hover:bg-gray-800'
                                }`}
                            >
                                {tab.icon}
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-6">
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-6">
                                <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-3 flex items-center">
                                    <FaInfoCircle className="mr-2" />
                                    Principe Général
                                </h3>
                                <p className="text-blue-800 dark:text-blue-200 leading-relaxed">
                                    Notre système de notation unifie tous les types de questions sur une échelle de <strong>0 à 5</strong> 
                                    pour permettre des comparaisons cohérentes et des analyses globales pertinentes.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-4">
                                    <div className="flex items-center mb-2">
                                        <FaChartBar className="text-green-600 dark:text-green-400 mr-2" />
                                        <h4 className="font-semibold text-green-900 dark:text-green-100">Questions Likert</h4>
                                    </div>
                                    <p className="text-green-800 dark:text-green-200 text-sm">
                                        Échelle 1-5 directe
                                    </p>
                                    <div className="mt-2 text-xs text-green-700 dark:text-green-300">
                                        Score = Moyenne des réponses
                                    </div>
                                </div>

                                <div className="bg-purple-50 dark:bg-purple-900 border border-purple-200 dark:border-purple-700 rounded-lg p-4">
                                    <div className="flex items-center mb-2">
                                        <FaToggleOn className="text-purple-600 dark:text-purple-400 mr-2" />
                                        <h4 className="font-semibold text-purple-900 dark:text-purple-100">Questions Oui/Non</h4>
                                    </div>
                                    <p className="text-purple-800 dark:text-purple-200 text-sm">
                                        % de "Oui" × 5
                                    </p>
                                    <div className="mt-2 text-xs text-purple-700 dark:text-purple-300">
                                        Score = Taux d'approbation
                                    </div>
                                </div>

                                <div className="bg-orange-50 dark:bg-orange-900 border border-orange-200 dark:border-orange-700 rounded-lg p-4">
                                    <div className="flex items-center mb-2">
                                        <FaComments className="text-orange-600 dark:text-orange-400 mr-2" />
                                        <h4 className="font-semibold text-orange-900 dark:text-orange-100">Questions Texte</h4>
                                    </div>
                                    <p className="text-orange-800 dark:text-orange-200 text-sm">
                                        Pas de score numérique
                                    </p>
                                    <div className="mt-2 text-xs text-orange-700 dark:text-orange-300">
                                        Analyse qualitative
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">📊 Interprétation des Scores</h4>
                                <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-center text-sm">
                                    <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-2 rounded">
                                        <div className="font-bold">0.0 - 1.0</div>
                                        <div>Très Faible</div>
                                    </div>
                                    <div className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 p-2 rounded">
                                        <div className="font-bold">1.1 - 2.0</div>
                                        <div>Faible</div>
                                    </div>
                                    <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 p-2 rounded">
                                        <div className="font-bold">2.1 - 3.0</div>
                                        <div>Moyen</div>
                                    </div>
                                    <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 p-2 rounded">
                                        <div className="font-bold">3.1 - 4.0</div>
                                        <div>Bon</div>
                                    </div>
                                    <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-2 rounded">
                                        <div className="font-bold">4.1 - 5.0</div>
                                        <div>Excellent</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'likert' && (
                        <div className="space-y-6">
                            <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-6">
                                <h3 className="text-xl font-bold text-green-900 dark:text-green-100 mb-4 flex items-center">
                                    <FaChartBar className="mr-2" />
                                    Questions à Échelle de Likert (1-5)
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="font-semibold mb-3 text-green-800 dark:text-green-200">📋 Principe</h4>
                                        <p className="text-green-700 dark:text-green-300 mb-4">
                                            Les questions Likert utilisent une échelle de 1 à 5 où chaque réponse a une valeur numérique directe.
                                        </p>
                                        
                                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-900 dark:text-gray-100">1 - Très insatisfait</span>
                                                    <span className="font-bold text-red-600 dark:text-red-400">1.0</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-900 dark:text-gray-100">2 - Insatisfait</span>
                                                    <span className="font-bold text-orange-600 dark:text-orange-400">2.0</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-900 dark:text-gray-100">3 - Neutre</span>
                                                    <span className="font-bold text-yellow-600 dark:text-yellow-400">3.0</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-900 dark:text-gray-100">4 - Satisfait</span>
                                                    <span className="font-bold text-blue-600 dark:text-blue-400">4.0</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-900 dark:text-gray-100">5 - Très satisfait</span>
                                                    <span className="font-bold text-green-600 dark:text-green-400">5.0</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <h4 className="font-semibold mb-3 text-green-800 dark:text-green-200">🧮 Calcul du Score</h4>
                                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                                            <div className="text-center mb-4">
                                                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                                    Score = Σ(réponses) ÷ N
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                                    Moyenne arithmétique simple
                                                </p>
                                            </div>
                                            
                                            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                                                <h5 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Exemple:</h5>
                                                <div className="text-sm space-y-1">
                                                    <div className="text-gray-900 dark:text-gray-100">Réponses: 5, 4, 5, 3, 4, 5</div>
                                                    <div className="text-gray-900 dark:text-gray-100">Somme: 26</div>
                                                    <div className="text-gray-900 dark:text-gray-100">Nombre: 6</div>
                                                    <div className="font-bold text-green-600 dark:text-green-400">Score: 26 ÷ 6 = 4.3/5</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'binary' && (
                        <div className="space-y-6">
                            <div className="bg-purple-50 dark:bg-purple-900 border border-purple-200 dark:border-purple-700 rounded-lg p-6">
                                <h3 className="text-xl font-bold text-purple-900 dark:text-purple-100 mb-4 flex items-center">
                                    <FaToggleOn className="mr-2" />
                                    Questions Binaires (Oui/Non)
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="font-semibold mb-3 text-purple-800 dark:text-purple-200">📋 Principe</h4>
                                        <p className="text-purple-700 dark:text-purple-300 mb-4">
                                            Les questions Oui/Non sont converties en scores 0-5 basés sur le pourcentage de réponses positives.
                                        </p>
                                        
                                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-900 dark:text-gray-100">🟢 Oui</span>
                                                    <span className="font-bold text-green-600 dark:text-green-400">Valeur: 1</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-900 dark:text-gray-100">🔴 Non</span>
                                                    <span className="font-bold text-red-600 dark:text-red-400">Valeur: 0</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <h4 className="font-semibold mb-3 text-purple-800 dark:text-purple-200">🧮 Calcul du Score</h4>
                                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                                            <div className="text-center mb-4">
                                                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                                    Score = (% Oui) × 5
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                                    Taux d'approbation converti
                                                </p>
                                            </div>
                                            
                                            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                                                <h5 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Exemple:</h5>
                                                <div className="text-sm space-y-1">
                                                    <div className="text-gray-900 dark:text-gray-100">Réponses: Oui, Oui, Non, Oui, Oui</div>
                                                    <div className="text-gray-900 dark:text-gray-100">Oui: 4/5 = 80%</div>
                                                    <div className="font-bold text-purple-600 dark:text-purple-400">Score: 0.8 × 5 = 4.0/5</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-6 bg-white dark:bg-gray-800 p-4 rounded-lg border">
                                    <h4 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">📊 Exemples de Conversion</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-center text-sm">
                                        <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-2 rounded">
                                            <div className="font-bold">0% Oui</div>
                                            <div>Score: 0.0</div>
                                        </div>
                                        <div className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 p-2 rounded">
                                            <div className="font-bold">40% Oui</div>
                                            <div>Score: 2.0</div>
                                        </div>
                                        <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 p-2 rounded">
                                            <div className="font-bold">60% Oui</div>
                                            <div>Score: 3.0</div>
                                        </div>
                                        <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 p-2 rounded">
                                            <div className="font-bold">80% Oui</div>
                                            <div>Score: 4.0</div>
                                        </div>
                                        <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-2 rounded">
                                            <div className="font-bold">100% Oui</div>
                                            <div>Score: 5.0</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'text' && (
                        <div className="space-y-6">
                            <div className="bg-orange-50 dark:bg-orange-900 border border-orange-200 dark:border-orange-700 rounded-lg p-6">
                                <h3 className="text-xl font-bold text-orange-900 dark:text-orange-100 mb-4 flex items-center">
                                    <FaComments className="mr-2" />
                                    Questions à Réponse Libre (Texte)
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="font-semibold mb-3 text-orange-800 dark:text-orange-200">📋 Principe</h4>
                                        <p className="text-orange-700 dark:text-orange-300 mb-4">
                                            Les questions texte ne reçoivent pas de score numérique car elles requièrent une analyse qualitative.
                                        </p>
                                        
                                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                                            <div className="space-y-3">
                                                <div className="flex items-center">
                                                    <span className="text-2xl mr-2">💭</span>
                                                    <div>
                                                        <div className="font-semibold text-gray-900 dark:text-gray-100">Analyse Qualitative</div>
                                                        <div className="text-sm text-gray-600 dark:text-gray-300">
                                                            Contenu, sentiments, suggestions
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="text-2xl mr-2">📊</span>
                                                    <div>
                                                        <div className="font-semibold text-gray-900 dark:text-gray-100">Métriques Quantitatives</div>
                                                        <div className="text-sm text-gray-600 dark:text-gray-300">
                                                            Nombre de réponses, longueur
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <h4 className="font-semibold mb-3 text-orange-800 dark:text-orange-200">🔍 Indicateurs</h4>
                                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                                            <div className="space-y-3 text-sm">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-900 dark:text-gray-100">📝 Nombre de réponses</span>
                                                    <span className="font-bold text-gray-900 dark:text-gray-100">Participation</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-900 dark:text-gray-100">📏 Longueur moyenne</span>
                                                    <span className="font-bold text-gray-900 dark:text-gray-100">Engagement</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-900 dark:text-gray-100">🏷️ Mots-clés fréquents</span>
                                                    <span className="font-bold text-gray-900 dark:text-gray-100">Thèmes</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-900 dark:text-gray-100">😊 Sentiment général</span>
                                                    <span className="font-bold text-gray-900 dark:text-gray-100">Satisfaction</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-6 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 p-4 rounded-lg">
                                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2 flex items-center">
                                        <FaInfoCircle className="mr-2" />
                                        Note Importante
                                    </h4>
                                    <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                                        Les questions texte n'influencent pas les scores globaux des formations. 
                                        Elles fournissent des insights qualitatifs précieux pour l'amélioration continue.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'calculation' && (
                        <div className="space-y-6">
                            <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-6">
                                <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-4 flex items-center">
                                    <FaCalculator className="mr-2" />
                                    Calculs Globaux et Moyennes
                                </h3>
                                
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                                            <h4 className="font-semibold mb-3 text-blue-800 dark:text-blue-200">📊 Score par Questionnaire</h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="text-gray-900 dark:text-gray-100">1. Calcul du score de chaque question</div>
                                                <div className="text-gray-900 dark:text-gray-100">2. Moyenne des questions par section</div>
                                                <div className="text-gray-900 dark:text-gray-100">3. Moyenne des sections</div>
                                                <div className="font-bold text-blue-600 dark:text-blue-400">= Score final du questionnaire</div>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                                            <h4 className="font-semibold mb-3 text-blue-800 dark:text-blue-200">🏫 Score par Formation</h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="text-gray-900 dark:text-gray-100">1. Score de chaque questionnaire</div>
                                                <div className="text-gray-900 dark:text-gray-100">2. Moyenne pondérée par le nombre de réponses</div>
                                                <div className="text-gray-900 dark:text-gray-100">3. Toutes les publications de la formation</div>
                                                <div className="font-bold text-blue-600 dark:text-blue-400">= Score final de la formation</div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                                        <h4 className="font-semibold mb-3 text-blue-800 dark:text-blue-200">🌐 Score Global du Système</h4>
                                        <div className="text-center">
                                            <div className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-2">
                                                Score Global = Σ(Score Formation × Nb Réponses) ÷ Σ(Nb Réponses)
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Moyenne pondérée de toutes les formations par leur participation
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border">
                                        <h4 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">⚖️ Exemple de Calcul Complet</h4>
                                        <div className="text-sm space-y-3">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="bg-green-100 dark:bg-green-900 p-3 rounded">
                                                    <div className="font-semibold text-green-800 dark:text-green-200">Formation A</div>
                                                    <div className="text-green-700 dark:text-green-300">Q1: 4.2/5 (50 réponses)</div>
                                                    <div className="text-green-700 dark:text-green-300">Q2: 3.8/5 (30 réponses)</div>
                                                    <div className="font-bold text-green-800 dark:text-green-200">Moyenne: 4.0/5</div>
                                                </div>
                                                <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded">
                                                    <div className="font-semibold text-blue-800 dark:text-blue-200">Formation B</div>
                                                    <div className="text-blue-700 dark:text-blue-300">Q1: 3.5/5 (40 réponses)</div>
                                                    <div className="text-blue-700 dark:text-blue-300">Q2: 4.1/5 (25 réponses)</div>
                                                    <div className="font-bold text-blue-800 dark:text-blue-200">Moyenne: 3.7/5</div>
                                                </div>
                                                <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded">
                                                    <div className="font-semibold text-purple-800 dark:text-purple-200">Score Global</div>
                                                    <div className="text-purple-700 dark:text-purple-300">(4.0×80 + 3.7×65) ÷ 145</div>
                                                    <div className="font-bold text-purple-800 dark:text-purple-200">= 3.9/5</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 flex-shrink-0">
                    <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-full">
                                <FaInfoCircle className="text-blue-600 dark:text-blue-300" />
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Ce guide est accessible à tout moment depuis l'icône d'information
                            </div>
                        </div>
                        
                        <div className="flex space-x-3">
                            {/* Download Button */}
                            <button
                                onClick={handleDownloadGuide}
                                disabled={isDownloading}
                                className={`
                                    relative px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 shadow-lg
                                    ${downloadSuccess 
                                        ? 'bg-green-600 hover:bg-green-700' 
                                        : isDownloading
                                        ? 'bg-blue-500 cursor-not-allowed opacity-75'
                                        : 'bg-green-500 hover:bg-green-600 hover:shadow-xl'
                                    }
                                `}
                            >
                                {downloadSuccess ? (
                                    <>
                                        <FaCheckCircle className="animate-bounce" />
                                        <span>Téléchargé !</span>
                                    </>
                                ) : isDownloading ? (
                                    <>
                                        <FaDownload className="animate-pulse" />
                                        <span>Téléchargement...</span>
                                    </>
                                ) : (
                                    <>
                                        <FaFilePdf />
                                        <span>Télécharger PDF</span>
                                    </>
                                )}
                            </button>
                            
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg hover:shadow-xl"
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                    
                    {/* Success Message */}
                    {downloadSuccess && (
                        <div className="mt-4 p-3 bg-green-100 dark:bg-green-800 border border-green-200 dark:border-green-700 rounded-lg flex items-center space-x-2 opacity-100 transition-opacity duration-500">
                            <FaCheckCircle className="text-green-600 dark:text-green-300" />
                            <span className="text-green-800 dark:text-green-200 text-sm font-medium">
                                Guide téléchargé avec succès ! 🎉
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ScoringExplanation;
