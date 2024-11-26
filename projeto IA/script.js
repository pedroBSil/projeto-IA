const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const emotionText = document.getElementById('emotion-text');
const ctx = canvas.getContext('2d');

// Configurações de inicialização
async function init() {
  // Solicita permissão para usar a webcam
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
  });
  video.srcObject = stream;

  // Carrega o modelo de detecção facial
  const faceModel = await blazeface.load();

  // Processa o vídeo em tempo real
  video.addEventListener('loadeddata', () => {
    detect(faceModel);
  });
}

// Função principal para detectar emoções
async function detect(faceModel) {
  const modelCoco = await cocoSsd.load();

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  setInterval(async () => {
    // Detectar rostos no frame atual
    const faces = await faceModel.estimateFaces(video, false);

    // Limpa o canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Itera sobre os rostos detectados
    faces.forEach((face) => {
      const start = face.topLeft;
      const end = face.bottomRight;
      const size = [end[0] - start[0], end[1] - start[1]];

      // Desenha o box ao redor do rosto
      ctx.strokeStyle = 'blue';
      ctx.lineWidth = 2;
      ctx.strokeRect(start[0], start[1], size[0], size[1]);

      // Exibe a emoção (dummy até integrar modelo emocional específico)
      emotionText.innerText = "Detecção em andamento...";
    });
  }, 100);
}

init();
