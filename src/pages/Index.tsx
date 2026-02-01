import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

type ClothingType = 'hoodie' | 'jacket' | 'blazer' | 'tshirt';

const Index = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedClothing, setSelectedClothing] = useState<ClothingType | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const clothingOptions = [
    { 
      id: 'hoodie' as ClothingType, 
      name: 'Худи', 
      icon: 'Shirt',
      image: 'https://cdn.poehali.dev/projects/15365aa1-9b6b-4020-aff7-abf52c180bcb/files/ae11b343-83ad-45d7-baac-ad7c04c92db3.jpg'
    },
    { 
      id: 'jacket' as ClothingType, 
      name: 'Куртка', 
      icon: 'Wind',
      image: 'https://cdn.poehali.dev/projects/15365aa1-9b6b-4020-aff7-abf52c180bcb/files/5a663a75-68f6-43f7-8ad3-d9542b35f952.jpg'
    },
    { 
      id: 'blazer' as ClothingType, 
      name: 'Пиджак', 
      icon: 'Briefcase',
      image: 'https://cdn.poehali.dev/projects/15365aa1-9b6b-4020-aff7-abf52c180bcb/files/652e9f8a-7c0c-4271-8d72-34045a679935.jpg'
    },
    { 
      id: 'tshirt' as ClothingType, 
      name: 'Футболка', 
      icon: 'User',
      image: 'https://cdn.poehali.dev/projects/15365aa1-9b6b-4020-aff7-abf52c180bcb/files/ae11b343-83ad-45d7-baac-ad7c04c92db3.jpg'
    },
  ];

  const handleFileUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleTryOn = async () => {
    if (!uploadedImage || !selectedClothing) return;

    setIsProcessing(true);
    setProgress(0);

    const progressSteps = [
      { value: 30, text: 'Анализируем фото...' },
      { value: 60, text: 'Подбираем образ...' },
      { value: 90, text: 'Применяем одежду...' },
      { value: 100, text: 'Готово!' },
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < progressSteps.length) {
        setProgress(progressSteps[currentStep].value);
        currentStep++;
      }
    }, 1200);

    try {
      const response = await fetch('https://functions.poehali.dev/tryon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userImage: uploadedImage,
          clothingType: selectedClothing
        })
      });

      const data = await response.json();
      clearInterval(interval);
      
      if (data.success) {
        setProgress(100);
        setTimeout(() => {
          setResult(data.resultImage);
          setIsProcessing(false);
        }, 500);
      } else {
        setIsProcessing(false);
        alert('Ошибка при обработке изображения');
      }
    } catch (error) {
      clearInterval(interval);
      setIsProcessing(false);
      alert('Не удалось подключиться к серверу');
    }
  };

  const handleReset = () => {
    setResult(null);
    setProgress(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 md:mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4 md:mb-6">
            Примерь одежду на себе<br />за 1 минуту
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Загрузи фото и посмотри, как ты будешь выглядеть в другой одежде
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto">
          {!result ? (
            <div className="space-y-8 animate-slide-up">
              {/* Upload Section */}
              <Card className="p-6 md:p-8">
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                  <Icon name="Upload" size={24} />
                  Загрузи своё фото
                </h2>
                
                {!uploadedImage ? (
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`border-2 border-dashed rounded-xl p-8 md:p-12 text-center transition-all ${
                      isDragging
                        ? 'border-secondary bg-secondary/10 scale-[1.02]'
                        : 'border-border hover:border-secondary/50 hover:bg-secondary/5'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center">
                        <Icon name="Image" size={32} className="text-secondary" />
                      </div>
                      <div>
                        <p className="text-lg font-medium mb-2">
                          Перетащи фото сюда или выбери файл
                        </p>
                        <p className="text-sm text-muted-foreground mb-4">
                          Фото по пояс или в полный рост • Ровный свет • Без сильных поворотов
                        </p>
                      </div>
                      <Button
                        size="lg"
                        className="bg-secondary hover:bg-secondary/90"
                        onClick={() => document.getElementById('file-upload')?.click()}
                      >
                        <Icon name="Upload" size={20} className="mr-2" />
                        Выбрать фото
                      </Button>
                      <input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file);
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 animate-scale-in">
                    <div className="relative rounded-xl overflow-hidden max-w-md mx-auto">
                      <img
                        src={uploadedImage}
                        alt="Uploaded"
                        className="w-full h-auto"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-4 right-4"
                        onClick={() => setUploadedImage(null)}
                      >
                        <Icon name="X" size={16} />
                      </Button>
                    </div>
                  </div>
                )}
              </Card>

              {/* Clothing Selection */}
              {uploadedImage && (
                <Card className="p-6 md:p-8 animate-scale-in">
                  <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                    <Icon name="Sparkles" size={24} />
                    Выбери тип одежды
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {clothingOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setSelectedClothing(option.id)}
                        className={`p-4 rounded-xl border-2 transition-all hover:scale-105 overflow-hidden ${
                          selectedClothing === option.id
                            ? 'border-secondary bg-secondary/10 shadow-lg'
                            : 'border-border hover:border-secondary/50'
                        }`}
                      >
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-100">
                            <img 
                              src={option.image} 
                              alt={option.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="font-medium text-sm">{option.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </Card>
              )}

              {/* Action Button */}
              {uploadedImage && (
                <div className="text-center animate-scale-in">
                  <Button
                    size="lg"
                    disabled={!selectedClothing || isProcessing}
                    onClick={handleTryOn}
                    className="bg-primary hover:bg-primary/90 px-12 py-6 text-lg"
                  >
                    <Icon name="Wand2" size={20} className="mr-2" />
                    Примерить одежду
                  </Button>
                </div>
              )}

              {/* Processing State */}
              {isProcessing && (
                <Card className="p-8 animate-scale-in">
                  <div className="space-y-6">
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
                      <h3 className="text-xl font-semibold">
                        {progress < 30 && 'Анализируем фото...'}
                        {progress >= 30 && progress < 60 && 'Подбираем образ...'}
                        {progress >= 60 && progress < 90 && 'Применяем одежду...'}
                        {progress >= 90 && 'Почти готово...'}
                      </h3>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <p className="text-center text-muted-foreground">
                      Нейросеть примеряет одежду, это займёт несколько секунд
                    </p>
                  </div>
                </Card>
              )}
            </div>
          ) : (
            /* Result Section */
            <div className="space-y-8 animate-fade-in">
              <Card className="p-6 md:p-8">
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                  <Icon name="Check" size={24} className="text-green-500" />
                  Результат готов!
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-3 font-medium">До</p>
                    <div className="rounded-xl overflow-hidden">
                      <img src={uploadedImage} alt="Before" className="w-full h-auto" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-3 font-medium">После</p>
                    <div className="rounded-xl overflow-hidden ring-2 ring-secondary">
                      <img src={result} alt="After" className="w-full h-auto" />
                    </div>
                  </div>
                </div>
              </Card>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={handleReset}
                  className="bg-secondary hover:bg-secondary/90"
                >
                  <Icon name="RotateCcw" size={20} className="mr-2" />
                  Примерить ещё раз
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = result || '';
                    link.download = `try-on-result-${Date.now()}.png`;
                    link.click();
                  }}
                >
                  <Icon name="Download" size={20} className="mr-2" />
                  Скачать результат
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Features Footer */}
        <div className="mt-16 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { icon: 'Zap', title: 'Быстро', desc: 'Результат за 1 минуту' },
            { icon: 'Sparkles', title: 'AI-технология', desc: 'Реалистичная примерка' },
            { icon: 'Lock', title: 'Безопасно', desc: 'Данные не сохраняются' },
          ].map((feature, i) => (
            <div key={i} className="text-center p-6 animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                <Icon name={feature.icon} size={24} className="text-secondary" />
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;