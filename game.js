import { sound } from './audio.js';
import { sprites } from './sprites.js';

export class GameEngine {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;

    // Resolução virtual retro estilo Stardew Valley / Game Boy Advance
    this.V_WIDTH = 480;
    this.V_HEIGHT = 320;
    this.TILE_SIZE = 16;

    // Estado Geral do Jogo
    this.currentArea = 1; // 1 = Natureza (Ano 1), 2 = Chile Neve (Ano 2), 3 = Piscina Estrelas (Ano 3)
    this.memoriesCollected = { 1: false, 2: false, 3: false };
    this.sushiCount = 0;
    this.brigadeiroCount = 0;
    this.roseCount = 0;
    this.speedBoostTimer = 0;
    this.gaveBouquet = false;
    this.lettersRead = { 1: false, 2: false, 3: false };
    this.unlockedPhotos = {};

    // As 11 Fotos Reais do Casal Bianca & Luca
    this.photos = [
      {
        id: 'ano1',
        title: '🌿 Ano 1: O Pedido de Namoro',
        year: 1,
        area: 1,
        src: 'assets/fotos/ano1.jpg?v=3',
        desc: 'Cercados pela natureza e folhagens tropicais... Você deslumbrante de vestido preto e eu fazendo o pedido mais certeiro e feliz da minha vida!',
        location: 'Ano 1 • Restaurante Verde',
        hint: 'Procure na mesa romântica à luz de velas no Ano 1'
      },
      {
        id: 'massa',
        title: '🍝 Amor É Massa! (Cozinhando Juntos)',
        year: 1,
        area: 1,
        src: 'assets/fotos/massa.jpg?v=3',
        desc: 'Nós dois de avental "Amor é Massa" preparando macarrão artesanal, brindando com Aperol Spritz e farinha na bochecha! Cozinhar com você é puro amor.',
        location: 'Ano 1 • Cantinho Gourmet',
        hint: 'Procure na bancada italiana de macarrão e Aperol no Ano 1'
      },
      {
        id: 'pordosol',
        title: '🌅 Pôr do Sol no Lago',
        year: 1,
        area: 1,
        src: 'assets/fotos/pordosol.jpg?v=3',
        desc: 'Céu cor-de-rosa deslumbrante no quiosque do lago. Curtindo o entardecer juntinhos, estilosos com óculos escuros e coração transbordando paz!',
        location: 'Ano 1 • Píer do Lago',
        hint: 'Procure na ponte de madeira do lago no Ano 1'
      },
      {
        id: 'abraco',
        title: '💖 O Abraço Mais Gostoso',
        year: 1,
        area: 1,
        src: 'assets/fotos/abraco.jpg?v=3',
        desc: 'No meio da multidão e da música, o melhor lugar do mundo sempre é e sempre será dentro do seu abraço apertado! Meu porto seguro.',
        location: 'Ano 1 • Banco sob a Cerejeira',
        hint: 'Procure no banco florido sob a árvore no Ano 1'
      },
      {
        id: 'ano2',
        title: '❄️ Ano 2: Santiago do Chile & Valle Nevado',
        year: 2,
        area: 2,
        src: 'assets/fotos/ano2.jpg?v=3',
        desc: 'Aquele beijo inesquecível no mirante com toda a cidade e a Cordilheira dos Andes ao fundo! Conhecendo a neve juntos e nos aquecendo com o nosso amor.',
        location: 'Ano 2 • Mirante dos Andes',
        hint: 'Procure no mirante com esquis na neve no Ano 2'
      },
      {
        id: 'mexicano',
        title: '🌮 Risadas Mexicanas & Sombreros',
        year: 2,
        area: 2,
        src: 'assets/fotos/mexicano.jpg?v=3',
        desc: 'A gente rindo até a barriga doer com os chapéus gigantes de mariachi! As melhores risadas da vida são com você!',
        location: 'Ano 2 • Cantinho Festivo',
        hint: 'Procure na barraquinha de chapéus mexicanos no Ano 2'
      },
      {
        id: 'gala',
        title: '🥂 Noite de Gala & Elegância',
        year: 2,
        area: 2,
        src: 'assets/fotos/gala.jpg?v=3',
        desc: 'Você deslumbrante de vestido rosa choque e eu de terno cinza, completamente hipnotizado e apaixonado pelo seu sorriso a noite inteira!',
        location: 'Ano 2 • Tapete Vermelho',
        hint: 'Procure na entrada de gala com taças no Ano 2'
      },
      {
        id: 'halloween1',
        title: '🎃 Chucky & Sua Noiva (Halloween)',
        year: 2,
        area: 2,
        src: 'assets/fotos/halloween1.jpg?v=3',
        desc: 'A melhor fantasia de casal de todos os tempos! Chucky e sua companheira perfeita de aventuras e travessuras.',
        location: 'Ano 2 • Abóbora de Halloween',
        hint: 'Procure na abóbora iluminada de Halloween no Ano 2'
      },
      {
        id: 'halloween2',
        title: '🧟 Zumbis Apaixonados (Festa a Fantasia)',
        year: 2,
        area: 2,
        src: 'assets/fotos/halloween2.jpg?v=3',
        desc: 'Com você eu encaro até o apocalipse zumbi! Sempre prontos para entrar em qualquer brincadeira juntos!',
        location: 'Ano 2 • Caldeirão Mágico',
        hint: 'Procure no caldeirão misterioso no Ano 2'
      },
      {
        id: 'ano3',
        title: '✨ Ano 3: Nosso Lar & Piscina Sob as Estrelas',
        year: 3,
        area: 3,
        src: 'assets/fotos/ano3.jpg?v=3',
        desc: 'Nós dois de branco juntinhos na piscina iluminada com luzinhas ao luar, celebrando cada conquista e os 3 anos mais felizes da minha existência!',
        location: 'Ano 3 • Beira da Piscina',
        hint: 'Procure na mesa com comida de rua na piscina do Ano 3'
      },
      {
        id: 'selfie',
        title: '🧢 Nossa Cumplicidade & Dias Simples',
        year: 3,
        area: 3,
        src: 'assets/fotos/selfie.jpg?v=3',
        desc: 'Selfie fofa de boné NYC e carinho. Amar você nos dias mais simples e na rotina é o que torna tudo perfeito e especial.',
        location: 'Ano 3 • Penteadeira do Amor',
        hint: 'Procure no espelho com moldura de coração no Ano 3'
      }
    ];

    // Carregar fotos salvas do localStorage
    this.loadUnlockedPhotos();

    // Novas Mecânicas Interativas
    this.kissCount = 0;
    this.isHoldingHands = false;
    this.handHoldHeartTimer = 0;
    this.footprints = [];
    this.waterRipples = [];
    this.fedZara = false;
    this.fedJully = false;
    this.toastTimeout = null;
    this.stepFootprintCounter = 0;

    // Jogadora: Bianca
    this.player = {
      x: 100,
      y: 140,
      w: 16,
      h: 22,
      speed: 1.5,
      dir: 'down',
      frame: 0,
      animTimer: 0,
      isMoving: false,
      stepDist: 0
    };

    // Acompanhante: Luca (segue a Bianca com amor)
    this.luca = {
      x: 80,
      y: 140,
      w: 16,
      h: 22,
      dir: 'down',
      frame: 0,
      animTimer: 0,
      isMoving: false,
      history: [] // fila de posições para seguir a Bianca perfeitamente
    };

    // Pets (Jully no Ano 1, Zara no Ano 2, e os dois juntos na piscina no Ano 3!)
    this.pets = [];

    // Partículas (pétalas, neve, estrelas, vaga-lumes, corações)
    this.particles = [];
    this.floatingTexts = [];

    // Câmera
    this.camera = { x: 0, y: 0 };

    // Controles
    this.keys = {};
    this.setupInputs();

    // Diálogo & UI
    this.dialogueActive = false;
    this.dialogueQueue = [];
    this.currentDialogue = null;
    this.typewriterIndex = 0;
    this.typewriterTimer = 0;

    // Sistema de Conquistas
    this.initAchievements();

    // Inicializar mapas e entidades
    this.initArea(1);
    this.updateAlbumUI();
    this.updateStatsUI();
    this.updateMemoryBadgeUI();

    // Ajuste de redimensionamento
    window.addEventListener('resize', () => this.resizeCanvas());
    this.resizeCanvas();

    // Loop
    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.gameLoop(t));
  }

  resizeCanvas() {
    // Mantém proporção pixelada perfeita no centro da tela
    const container = document.getElementById('canvas-container');
    const cWidth = container.clientWidth;
    const cHeight = container.clientHeight;

    const scale = Math.min(cWidth / this.V_WIDTH, cHeight / this.V_HEIGHT);
    this.canvas.width = this.V_WIDTH;
    this.canvas.height = this.V_HEIGHT;

    this.canvas.style.width = `${Math.floor(this.V_WIDTH * scale)}px`;
    this.canvas.style.height = `${Math.floor(this.V_HEIGHT * scale)}px`;
    this.ctx.imageSmoothingEnabled = false;
  }

  setupInputs() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.key.toLowerCase()] = true;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' || e.key.toLowerCase() === 'e' || e.key === 'Enter') {
        this.handleAction();
      }

      // Atalhos das novas mecânicas
      if (e.key.toLowerCase() === 'b') {
        this.triggerKiss();
      }
      if (e.key.toLowerCase() === 'f') {
        this.triggerFeedPet();
      }
      if (e.key.toLowerCase() === 'h') {
        this.toggleHoldHands();
      }
      if (e.key.toLowerCase() === 'r') {
        this.triggerGiveBouquet();
      }
      if (e.key.toLowerCase() === 'p') {
        const albumModal = document.getElementById('album-modal');
        if (albumModal && albumModal.classList.contains('active')) {
          albumModal.classList.remove('active');
        } else {
          this.openAlbumModal();
        }
      }
      if (e.key.toLowerCase() === 'c') {
        const modal = document.getElementById('achievements-modal');
        if (modal && modal.classList.contains('active')) {
          modal.classList.remove('active');
        } else {
          this.openAchievementsModal();
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
    });

    // Touch controls para celular / touch screens
    this.setupTouchControls();
  }

  setupTouchControls() {
    const bindBtn = (id, key) => {
      const btn = document.getElementById(id);
      if (!btn) return;
      btn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.keys[key] = true;
      });
      btn.addEventListener('touchend', (e) => {
        e.preventDefault();
        this.keys[key] = false;
      });
      btn.addEventListener('mousedown', () => {
        this.keys[key] = true;
      });
      btn.addEventListener('mouseup', () => {
        this.keys[key] = false;
      });
    };

    bindBtn('btn-up', 'arrowup');
    bindBtn('btn-down', 'arrowdown');
    bindBtn('btn-left', 'arrowleft');
    bindBtn('btn-right', 'arrowright');

    const actionBtn = document.getElementById('btn-action');
    if (actionBtn) {
      actionBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleAction();
      });
      actionBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.handleAction();
      });
    }

    // Clique ou toque direto no Canvas para interagir com elementos
    this.canvas.addEventListener('click', (e) => {
      this.handleCanvasClick(e);
    });
    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches[0]) {
        this.handleCanvasClick(e.touches[0]);
      }
    });
  }

  handleCanvasClick(e) {
    sound.init();
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.V_WIDTH / rect.width;
    const scaleY = this.V_HEIGHT / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX + this.camera.x;
    const clickY = (e.clientY - rect.top) * scaleY + this.camera.y;

    // Se estiver em diálogo, clica para avançar
    if (this.dialogueActive) {
      this.handleAction();
      return;
    }

    // Verificar se clicou em algum objeto interativo
    for (const obj of this.interactables) {
      const ox = obj.x + (obj.w || 24) / 2;
      const oy = obj.y + (obj.h || 24) / 2;
      if (Math.hypot(clickX - ox, clickY - oy) < 32) {
        this.interactWithObject(obj);
        return;
      }
    }

    // Verificar se clicou em algum pet
    for (const pet of this.pets) {
      if (Math.hypot(clickX - (pet.x + 10), clickY - (pet.y + 10)) < 26) {
        sound.playPetHeart();
        sound.playBark(pet.type === 'zara');
        this.addHeart(pet.x + 8, pet.y);
        pet.jumpTimer = 0.8;
        this.showDialogue(pet.name, pet.say, pet.type);
        return;
      }
    }

    // Se clicou no Luca
    if (Math.hypot(clickX - (this.luca.x + 8), clickY - (this.luca.y + 10)) < 28) {
      this.talkToLuca();
      return;
    }

    // Ação geral
    this.handleAction();
  }

  handleAction() {
    sound.init();

    // Se estiver em diálogo, avança o texto ou fecha
    if (this.dialogueActive) {
      if (this.typewriterIndex < this.currentDialogue.text.length) {
        // Pula o efeito de máquina de escrever
        this.typewriterIndex = this.currentDialogue.text.length;
        document.getElementById('dialogue-text').innerText = this.currentDialogue.text;
      } else {
        // Próxima fala da fila
        this.nextDialogue();
      }
      return;
    }

    // Tentar interagir com objetos ou personagens próximos
    this.checkInteractions();
  }

  // ==========================================
  // CONFIGURAÇÃO DOS 3 CENÁRIOS
  // ==========================================
  initArea(areaNum) {
    this.currentArea = areaNum;
    this.particles = [];
    this.collectibles = [];
    this.interactables = [];
    this.pets = [];
    this.footprints = [];
    this.waterRipples = [];

    // Limpar histórico do companheiro
    this.luca.history = [];

    if (areaNum === 1) {
      // ------------------------------------------
      // ANO 1: RESTAURANTE NA NATUREZA (O PEDIDO)
      // ------------------------------------------
      this.mapWidth = 600;
      this.mapHeight = 400;
      this.player.x = 80;
      this.player.y = 200;
      this.luca.x = 55;
      this.luca.y = 200;

      // Jully brincando entre as flores
      this.pets.push({
        type: 'jully',
        name: 'Jully',
        x: 230,
        y: 170,
        frame: 0,
        timer: 0,
        say: 'Au au! A Jully está muito feliz de ver a mamãe Bianca no jardim florido! *abana o rabinho*'
      });

      // Foto 1: Mesa Romântica do Pedido (Ano 1)
      this.interactables.push({
        id: 'photo_ano1',
        x: 320,
        y: 140,
        w: 36,
        h: 36,
        type: 'photo',
        photoId: 'ano1',
        year: 1,
        title: 'Mesa do Pedido de Namoro',
        prompt: 'Pressione [E] para ver a Foto: O Pedido de Namoro 📸'
      });

      // Foto 2: Bancada de Massa Artesanal & Aperol
      this.interactables.push({
        id: 'photo_massa',
        x: 140,
        y: 260,
        w: 32,
        h: 24,
        type: 'photo',
        photoId: 'massa',
        title: 'Amor É Massa!',
        prompt: 'Pressione [E] para ver a Foto: Amor É Massa! 🍝📸'
      });

      // Foto 3: Píer do Lago ao Pôr do Sol
      this.interactables.push({
        id: 'photo_pordosol',
        x: 205,
        y: 300,
        w: 30,
        h: 24,
        type: 'photo',
        photoId: 'pordosol',
        title: 'Pôr do Sol no Lago',
        prompt: 'Pressione [E] para ver a Foto: Pôr do Sol no Lago 🌅📸'
      });

      // Foto 4: Banco Romântico sob a Cerejeira
      this.interactables.push({
        id: 'photo_abraco',
        x: 440,
        y: 250,
        w: 28,
        h: 22,
        type: 'photo',
        photoId: 'abraco',
        title: 'O Abraço Mais Gostoso',
        prompt: 'Pressione [E] para ver a Foto: O Abraço Mais Gostoso 💖📸'
      });

      // Cartinha Secreta do Luca 1
      this.interactables.push({
        id: 'letter_1',
        x: 260,
        y: 90,
        w: 20,
        h: 20,
        type: 'letter',
        num: 1,
        prompt: 'Pressione [E] para ler a Cartinha Secreta 💌',
        text: 'Bilhetinho do Luca (Ano 1): "Minha loirinha, no instante em que você aceitou namorar comigo naquele restaurante verde, eu soube que a vida nunca mais seria a mesma. Obrigado por ser minha paz e minha alegria desde o primeiro segundo!"'
      });

      // Rosas do Amor para colher
      this.collectibles.push({ type: 'rose', x: 100, y: 100, collected: false });
      this.collectibles.push({ type: 'rose', x: 480, y: 110, collected: false });

      // Comidinhas deliciosas para coletar
      this.collectibles.push({ type: 'sushi', x: 160, y: 130, collected: false });
      this.collectibles.push({ type: 'brigadeiro', x: 260, y: 240, collected: false });
      this.collectibles.push({ type: 'sushi', x: 420, y: 110, collected: false });

      // Plaquinhas fofas
      this.interactables.push({
        id: 'sign_1',
        x: 110,
        y: 150,
        w: 20,
        h: 20,
        type: 'sign',
        text: 'Placa: "Bem-vinda ao Jardim do Começo de Tudo. Onde duas almas disseram SIM ao destino!"'
      });

      // Portal para o Ano 2 (Chile)
      this.interactables.push({
        id: 'portal_to_2',
        x: 540,
        y: 190,
        w: 32,
        h: 40,
        type: 'portal',
        targetArea: 2,
        prompt: 'Ir para o Ano 2: Aventura no Chile ➔'
      });

      // Atualizar indicador visual no topo
      this.updateAreaUI('Ano 1: O Pedido de Namoro no Restaurante Verde');

    } else if (areaNum === 2) {
      // ------------------------------------------
      // ANO 2: SANTIAGO DO CHILE & VALLE NEVADO
      // ------------------------------------------
      this.mapWidth = 640;
      this.mapHeight = 400;
      this.player.x = 80;
      this.player.y = 200;
      this.luca.x = 55;
      this.luca.y = 200;

      // Zara brincando na neve
      this.pets.push({
        type: 'zara',
        name: 'Zara',
        x: 270,
        y: 190,
        frame: 0,
        timer: 0,
        say: 'Snort! A Zara deu um pulinho na neve e sacudiu as orelhinhas em pé! Ela ama esquiar com vocês!'
      });

      // Foto 5: Mirante dos Andes em Valle Nevado (Ano 2)
      this.interactables.push({
        id: 'photo_ano2',
        x: 340,
        y: 150,
        w: 36,
        h: 36,
        type: 'photo',
        photoId: 'ano2',
        year: 2,
        title: 'Mirante dos Andes em Valle Nevado',
        prompt: 'Pressione [E] para ver a Foto: Valle Nevado & Neve ❄️📸'
      });

      // Foto 6: Cantinho dos Sombreros Mexicanos
      this.interactables.push({
        id: 'photo_mexicano',
        x: 160,
        y: 280,
        w: 28,
        h: 22,
        type: 'photo',
        photoId: 'mexicano',
        title: 'Risadas Mexicanas',
        prompt: 'Pressione [E] para ver a Foto: Risadas Mexicanas 🌮📸'
      });

      // Foto 7: Tapete Vermelho & Entrada de Gala
      this.interactables.push({
        id: 'photo_gala',
        x: 450,
        y: 270,
        w: 32,
        h: 28,
        type: 'photo',
        photoId: 'gala',
        title: 'Noite de Gala',
        prompt: 'Pressione [E] para ver a Foto: Noite de Gala 🥂📸'
      });

      // Foto 8: Abóbora de Halloween (Chucky & Sua Noiva)
      this.interactables.push({
        id: 'photo_halloween1',
        x: 140,
        y: 110,
        w: 22,
        h: 22,
        type: 'photo',
        photoId: 'halloween1',
        title: 'Chucky & Sua Noiva',
        prompt: 'Pressione [E] para ver a Foto: Chucky & Sua Noiva 🎃📸'
      });

      // Foto 9: Caldeirão Mágico (Zumbis Apaixonados)
      this.interactables.push({
        id: 'photo_halloween2',
        x: 480,
        y: 110,
        w: 24,
        h: 24,
        type: 'photo',
        photoId: 'halloween2',
        title: 'Zumbis Apaixonados',
        prompt: 'Pressione [E] para ver a Foto: Zumbis Apaixonados 🧟📸'
      });

      // Cartinha Secreta do Luca 2
      this.interactables.push({
        id: 'letter_2',
        x: 290,
        y: 290,
        w: 20,
        h: 20,
        type: 'letter',
        num: 2,
        prompt: 'Pressione [E] para ler a Cartinha Secreta 💌',
        text: 'Bilhetinho do Luca (Ano 2): "Subir a Cordilheira dos Andes e sentir o vento gelado de Valle Nevado só me fez querer te abraçar ainda mais forte. Com você, até congelando eu me sinto no lugar mais quentinho do universo!"'
      });

      // Rosas do Amor
      this.collectibles.push({ type: 'rose', x: 200, y: 90, collected: false });
      this.collectibles.push({ type: 'rose', x: 410, y: 310, collected: false });

      this.collectibles.push({ type: 'brigadeiro', x: 190, y: 120, collected: false });
      this.collectibles.push({ type: 'sushi', x: 230, y: 280, collected: false });
      this.collectibles.push({ type: 'brigadeiro', x: 430, y: 170, collected: false });

      // Boneco de neve interativo
      this.interactables.push({
        id: 'snowman',
        x: 180,
        y: 220,
        w: 24,
        h: 24,
        type: 'sign',
        text: 'Um boneco de neve fofo com cachecol rosa que o Luca e você montaram juntos!'
      });

      // Portal para o Ano 3
      this.interactables.push({
        id: 'portal_to_3',
        x: 580,
        y: 190,
        w: 32,
        h: 40,
        type: 'portal',
        targetArea: 3,
        prompt: 'Ir para o Ano 3: Nosso Lar & Noite Estrelada ➔'
      });

      // Portal de volta para o Ano 1
      this.interactables.push({
        id: 'portal_back_1',
        x: 20,
        y: 190,
        w: 24,
        h: 40,
        type: 'portal',
        targetArea: 1,
        prompt: '⬅ Voltar para o Ano 1'
      });

      this.updateAreaUI('Ano 2: Viagem dos Sonhos - Neve em Santiago do Chile');

    } else if (areaNum === 3) {
      // ------------------------------------------
      // ANO 3: CASA DO LUCA - PISCINA & ESTRELAS
      // ------------------------------------------
      this.mapWidth = 600;
      this.mapHeight = 400;
      this.player.x = 80;
      this.player.y = 220;
      this.luca.x = 55;
      this.luca.y = 220;

      // Os dois cachorrinhos juntos na casa!
      this.pets.push({
        type: 'zara',
        name: 'Zara',
        x: 140,
        y: 260,
        frame: 0,
        timer: 0,
        say: 'Zara: *ronronar feliz de buldogue* Deitadinha perto da piscina, esperando cair uma batatinha frita!'
      });

      this.pets.push({
        type: 'jully',
        name: 'Jully',
        x: 180,
        y: 270,
        frame: 0,
        timer: 0,
        say: 'Jully: *au au!* A Jully veio correndo te dar lambeijinhos na beira da piscina!'
      });

      // Foto 10: Mesa de Jantar sob as Estrelas na Piscina (Ano 3)
      this.interactables.push({
        id: 'photo_ano3',
        x: 280,
        y: 200,
        w: 48,
        h: 36,
        type: 'photo',
        photoId: 'ano3',
        year: 3,
        title: 'Mesa do Nosso Jantar Sob as Estrelas',
        prompt: 'Pressione [E] para ver a Foto: Piscina & Noite Estrelada ✨📸'
      });

      // Foto 11: Penteadeira / Espelho de Selfie de Boné
      this.interactables.push({
        id: 'photo_selfie',
        x: 460,
        y: 270,
        w: 24,
        h: 26,
        type: 'photo',
        photoId: 'selfie',
        title: 'Nossa Cumplicidade',
        prompt: 'Pressione [E] para ver a Foto: Nossa Cumplicidade 🧢📸'
      });

      // Cartinha Secreta do Luca 3
      this.interactables.push({
        id: 'letter_3',
        x: 510,
        y: 120,
        w: 20,
        h: 20,
        type: 'letter',
        num: 3,
        prompt: 'Pressione [E] para ler a Cartinha Secreta 💌',
        text: 'Bilhetinho do Luca (Ano 3): "Três anos... Nós dois de branco, a piscina brilhando, a Zara e a Jully deitadinhas do nosso lado. Construir esse lar com você é a realização do meu maior sonho. Que venha a nossa vida inteira juntos!"'
      });

      // Rosas do Amor
      this.collectibles.push({ type: 'rose', x: 100, y: 280, collected: false });
      this.collectibles.push({ type: 'rose', x: 380, y: 110, collected: false });

      // O GRANDE BAÚ DOURADO DOS 3 ANOS
      this.interactables.push({
        id: 'chest_3',
        x: 430,
        y: 190,
        w: 32,
        h: 32,
        type: 'chest',
        prompt: 'Pressione [E] para abrir o Baú de 3 Anos de Amor! 👑'
      });

      // Portal de volta para o Ano 2
      this.interactables.push({
        id: 'portal_back_2',
        x: 20,
        y: 210,
        w: 24,
        h: 40,
        type: 'portal',
        targetArea: 2,
        prompt: '⬅ Voltar para o Chile'
      });

      this.collectibles.push({ type: 'sushi', x: 230, y: 140, collected: false });
      this.collectibles.push({ type: 'brigadeiro', x: 370, y: 270, collected: false });

      this.updateAreaUI('Ano 3: Nosso Lar - Jantar na Piscina & Céu Estrelado');
    }

    // Gerar partículas de fundo
    this.seedAmbientParticles();
  }

  updateAreaUI(title) {
    const el = document.getElementById('current-area-title');
    if (el) el.innerText = title;
  }

  seedAmbientParticles() {
    this.particles = [];
    const count = this.currentArea === 3 ? 60 : 35;
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.mapWidth,
        y: Math.random() * this.mapHeight,
        vx: this.currentArea === 2 ? -0.4 + Math.random() * 0.8 : -0.2 + Math.random() * 0.4,
        vy: this.currentArea === 2 ? 0.8 + Math.random() * 1.2 : 0.3 + Math.random() * 0.5,
        size: Math.random() * 3 + 1,
        alpha: Math.random() * 0.8 + 0.2,
        pulse: Math.random() * Math.PI,
        type: this.currentArea === 1 ? 'petal' : (this.currentArea === 2 ? 'snow' : 'star')
      });
    }
  }

  // ==========================================
  // LOOP PRINCIPAL DE ATUALIZAÇÃO
  // ==========================================
  gameLoop(now) {
    const dt = Math.min((now - this.lastTime) / 1000, 0.1);
    this.lastTime = now;

    this.update(dt);
    this.render();

    requestAnimationFrame((t) => this.gameLoop(t));
  }

  update(dt) {
    if (!this.dialogueActive) {
      this.updatePlayer(dt);
      this.updateLuca(dt);
    }
    this.updatePets(dt);
    this.updateParticles(dt);
    this.updateCollectibles(dt);
    this.updateFootprints(dt);
    this.updateWaterRipples(dt);
    this.updateDialogue(dt);
    this.updateCamera();
  }

  updatePlayer(dt) {
    let dx = 0;
    let dy = 0;

    if (this.keys['arrowup'] || this.keys['w']) dy -= 1;
    if (this.keys['arrowdown'] || this.keys['s']) dy += 1;
    if (this.keys['arrowleft'] || this.keys['a']) dx -= 1;
    if (this.keys['arrowright'] || this.keys['d']) dx += 1;

    // Normalizar velocidade diagonal
    if (dx !== 0 && dy !== 0) {
      dx *= 0.7071;
      dy *= 0.7071;
    }

    // Boost de velocidade ao comer Sushi / Brigadeiro
    let currentSpeed = this.player.speed;
    if (this.speedBoostTimer > 0) {
      this.speedBoostTimer -= dt;
      currentSpeed *= 1.45;
      // Emitir coraçõezinhos dos pezinhos
      if (Math.random() < 0.25) {
        this.addHeart(this.player.x + 8, this.player.y + 18);
      }
    }

    if (dx !== 0 || dy !== 0) {
      this.player.isMoving = true;
      const prevX = this.player.x;
      const prevY = this.player.y;

      this.player.x += dx * currentSpeed * 60 * dt;
      this.player.y += dy * currentSpeed * 60 * dt;

      // Limites do mapa
      this.player.x = Math.max(16, Math.min(this.mapWidth - 32, this.player.x));
      this.player.y = Math.max(32, Math.min(this.mapHeight - 32, this.player.y));

      // Direção
      if (Math.abs(dx) > Math.abs(dy)) {
        this.player.dir = dx > 0 ? 'right' : 'left';
      } else {
        this.player.dir = dy > 0 ? 'down' : 'up';
      }

      // Animação de passos
      this.player.animTimer += dt * (this.speedBoostTimer > 0 ? 12 : 8);
      if (this.player.animTimer >= 1) {
        this.player.animTimer = 0;
        this.player.frame = (this.player.frame + 1) % 3;
      }

      // Som de passos leves
      const stepDistance = Math.hypot(this.player.x - prevX, this.player.y - prevY);
      this.player.stepDist += stepDistance;
      if (this.player.stepDist > 30) {
        this.player.stepDist = 0;
        sound.playStep(this.currentArea === 2);
      }

      // Efeito de Pegadas na neve no Ano 2 (Chile)
      if (this.currentArea === 2) {
        this.stepFootprintCounter += stepDistance;
        if (this.stepFootprintCounter > 18) {
          this.stepFootprintCounter = 0;
          this.footprints.push({
            x: Math.floor(this.player.x + 6),
            y: Math.floor(this.player.y + 16),
            alpha: 0.7,
            life: 6.0
          });
          if (this.footprints.length > 50) this.footprints.shift();
        }
      }

      // Efeito de Marolas perto da piscina no Ano 3
      if (this.currentArea === 3) {
        const nearPool = (this.player.x >= 55 && this.player.x <= 235 && this.player.y >= 55 && this.player.y <= 165);
        if (nearPool) {
          this.unlockAchievement('pool_splash');
          if (Math.random() < 0.28) {
            this.waterRipples.push({
              x: Math.floor(this.player.x + 8),
              y: Math.floor(this.player.y + 14),
              radius: 2,
              alpha: 0.8,
              life: 1.2
            });
            if (this.waterRipples.length > 30) this.waterRipples.shift();
          }
        }
      }

      // Gravar histórico para o companheiro Luca seguir
      this.luca.history.push({
        x: this.player.x,
        y: this.player.y,
        dir: this.player.dir
      });
      if (this.luca.history.length > 25) {
        this.luca.history.shift();
      }

      // Transição automática ao passar pelo portal / arco
      for (const obj of this.interactables) {
        if (obj.type === 'portal') {
          const portalCenterX = obj.x + (obj.w || 30) / 2;
          const portalCenterY = obj.y + (obj.h || 30) / 2;
          const dist = Math.hypot(this.player.x - portalCenterX, this.player.y - portalCenterY);
          if (dist < 24) {
            sound.playTone(587.33, 'sine', 0.2, 0.1, 100);
            this.initArea(obj.targetArea);
            return;
          }
        }
      }

    } else {
      this.player.isMoving = false;
      this.player.frame = 0;
    }
  }

  // Atualiza o Luca como companheiro fiel ou de mãos dadas
  updateLuca(dt) {
    if (this.isHoldingHands) {
      // De mãos dadas: Luca caminha coladinho ao lado da Bianca
      let targetX = this.player.x - 16;
      let targetY = this.player.y;
      if (this.player.dir === 'left') targetX = this.player.x + 16;
      else if (this.player.dir === 'up') { targetX = this.player.x - 16; targetY = this.player.y; }
      else if (this.player.dir === 'down') { targetX = this.player.x - 16; targetY = this.player.y; }

      this.luca.x += (targetX - this.luca.x) * 0.25;
      this.luca.y += (targetY - this.luca.y) * 0.25;
      this.luca.dir = this.player.dir;
      this.luca.isMoving = this.player.isMoving;
      this.luca.frame = this.player.frame;

      // Soltar coraçõezinhos das mãos enquanto andam juntos
      this.handHoldHeartTimer += dt;
      if (this.player.isMoving && this.handHoldHeartTimer > 0.4) {
        this.handHoldHeartTimer = 0;
        this.floatingTexts.push({
          x: (this.player.x + this.luca.x) / 2 + 8,
          y: (this.player.y + this.luca.y) / 2 + 4,
          text: '💕',
          life: 0.9,
          scale: 0.9
        });
      }
      return;
    }

    if (this.luca.history.length > 18) {
      const target = this.luca.history[0];
      const dist = Math.hypot(target.x - this.luca.x, target.y - this.luca.y);

      if (dist > 4) {
        this.luca.isMoving = true;
        this.luca.x += (target.x - this.luca.x) * 0.15;
        this.luca.y += (target.y - this.luca.y) * 0.15;
        this.luca.dir = target.dir;

        this.luca.animTimer += dt * 8;
        if (this.luca.animTimer >= 1) {
          this.luca.animTimer = 0;
          this.luca.frame = (this.luca.frame + 1) % 3;
        }
      } else {
        this.luca.isMoving = false;
        this.luca.frame = 0;
      }
    } else {
      this.luca.isMoving = false;
      this.luca.frame = 0;
    }
  }

  updatePets(dt) {
    this.pets.forEach(pet => {
      pet.timer += dt * 3;
      if (pet.timer >= 1) {
        pet.timer = 0;
        pet.frame = (pet.frame + 1) % 2;
      }

      if (pet.jumpTimer > 0) {
        pet.jumpTimer = Math.max(0, pet.jumpTimer - dt);
        if (Math.random() < 0.2) {
          this.addHeart(pet.x + 8, pet.y - 4);
        }
      }
    });
  }

  updateFootprints(dt) {
    for (let i = this.footprints.length - 1; i >= 0; i--) {
      const fp = this.footprints[i];
      fp.life -= dt;
      fp.alpha = Math.max(0, (fp.life / 6.0) * 0.7);
      if (fp.life <= 0) {
        this.footprints.splice(i, 1);
      }
    }
  }

  updateWaterRipples(dt) {
    for (let i = this.waterRipples.length - 1; i >= 0; i--) {
      const r = this.waterRipples[i];
      r.life -= dt;
      r.radius += dt * 10;
      r.alpha = Math.max(0, (r.life / 1.2) * 0.8);
      if (r.life <= 0) {
        this.waterRipples.splice(i, 1);
      }
    }
  }

  updateParticles(dt) {
    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.pulse += dt * 2;

      // Wrap em torno do mapa
      if (p.y > this.mapHeight) {
        p.y = 0;
        p.x = Math.random() * this.mapWidth;
      }
      if (p.x < 0) p.x = this.mapWidth;
      if (p.x > this.mapWidth) p.x = 0;
    });

    // Atualizar corações e textos flutuantes
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const item = this.floatingTexts[i];
      item.y -= dt * 25;
      item.life -= dt;
      if (item.life <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }
  }

  addHeart(x, y) {
    this.floatingTexts.push({
      x,
      y,
      text: '❤️',
      life: 1.2,
      scale: 1
    });
  }

  addFloatingText(x, y, text, color = '#FFD700') {
    this.floatingTexts.push({
      x,
      y,
      text,
      color,
      life: 1.5,
      scale: 1
    });
  }

  updateCollectibles(dt) {
    this.collectibles.forEach(item => {
      if (!item.collected) {
        const dist = Math.hypot(this.player.x - item.x, this.player.y - item.y);
        if (dist < 18) {
          item.collected = true;
          this.speedBoostTimer = 5.0; // 5 segundos de energia e corações!

          if (item.type === 'rose') {
            this.roseCount++;
            sound.playRosePickup();
            this.addFloatingText(item.x, item.y, '+1 Rosa do Amor! 🌹', '#FF4D7E');
            if (this.roseCount === 3) {
              this.addFloatingText(this.player.x, this.player.y - 24, '💐 Buquê Completo! Aperte [R] para presentear o Luca!', '#FFD700');
            }
          } else if (item.type === 'sushi') {
            sound.playCollect();
            this.sushiCount++;
            this.addFloatingText(item.x, item.y, '+1 Sushi Delicioso! 🍣', '#FF6B6B');
            if (this.sushiCount >= 3) {
              this.unlockAchievement('all_sushi');
            }
          } else {
            sound.playCollect();
            this.brigadeiroCount++;
            this.addFloatingText(item.x, item.y, '+1 Brigadeiro Amado! 🍫', '#8B5A2B');
            if (this.brigadeiroCount >= 3) {
              this.unlockAchievement('all_brigadeiro');
            }
          }
          this.updateStatsUI();
        }
      }
    });
  }

  updateStatsUI() {
    const elSushi = document.getElementById('sushi-count');
    const elBrig = document.getElementById('brigadeiro-count');
    const elRose = document.getElementById('rose-count');
    if (elSushi) elSushi.innerText = this.sushiCount;
    if (elBrig) elBrig.innerText = this.brigadeiroCount;
    if (elRose) elRose.innerText = this.roseCount;
  }

  updateCamera() {
    // A câmera foca suavemente na Bianca
    const targetCamX = this.player.x - this.V_WIDTH / 2;
    const targetCamY = this.player.y - this.V_HEIGHT / 2;

    this.camera.x += (targetCamX - this.camera.x) * 0.1;
    this.camera.y += (targetCamY - this.camera.y) * 0.1;

    // Limites de câmera
    this.camera.x = Math.max(0, Math.min(this.mapWidth - this.V_WIDTH, this.camera.x));
    this.camera.y = Math.max(0, Math.min(this.mapHeight - this.V_HEIGHT, this.camera.y));
  }

  // ==========================================
  // SISTEMA DE INTERAÇÕES E DIÁLOGOS ROBUSTO
  // ==========================================
  checkInteractions() {
    const px = this.player.x + 8;
    const py = this.player.y + 11;

    // 1. PRIORIDADE MÁXIMA: Objetos do mundo (Fotos, Cartinhas, Baú, Placas, Portais)
    let closestObj = null;
    let minObjDist = 52; // Distância generosa para interação fácil

    for (const obj of this.interactables) {
      const ox = obj.x + (obj.w || 24) / 2;
      const oy = obj.y + (obj.h || 24) / 2;
      const dist = Math.hypot(px - ox, py - oy);
      if (dist < minObjDist) {
        closestObj = obj;
        minObjDist = dist;
      }
    }

    if (closestObj) {
      this.interactWithObject(closestObj);
      return;
    }

    // 2. Pets (Jully & Zara)
    let closestPet = null;
    let minPetDist = 42;
    for (const pet of this.pets) {
      const petX = pet.x + 10;
      const petY = pet.y + 10;
      const dist = Math.hypot(px - petX, py - petY);
      if (dist < minPetDist) {
        closestPet = pet;
        minPetDist = dist;
      }
    }

    if (closestPet) {
      sound.playPetHeart();
      sound.playBark(closestPet.type === 'zara');
      this.addHeart(closestPet.x + 8, closestPet.y);
      closestPet.jumpTimer = 0.8;
      this.showDialogue(closestPet.name, closestPet.say, closestPet.type);
      return;
    }

    // 3. Luca (Apenas se não houver objetos próximos prioritários)
    const lucaX = this.luca.x + 8;
    const lucaY = this.luca.y + 11;
    const distToLuca = Math.hypot(px - lucaX, py - lucaY);
    if (distToLuca < 42) {
      this.talkToLuca();
      return;
    }
  }

  interactWithObject(obj) {
    if (obj.type === 'photo') {
      this.unlockPhoto(obj.photoId);
      return;
    }

    if (obj.type === 'letter') {
      sound.playLetterOpen();
      this.lettersRead[obj.num] = true;
      if (Object.values(this.lettersRead).filter(Boolean).length === 3) {
        this.unlockAchievement('letters_love');
      }
      this.addHeart(obj.x + 10, obj.y);
      this.showDialogue('Cartinha do Luca ❤️', obj.text, 'luca');
      return;
    }

    if (obj.type === 'memory') {
      this.unlockMemory(obj.year);
      return;
    }

    if (obj.type === 'chest') {
      this.openFinalChest();
      return;
    }

    if (obj.type === 'portal') {
      sound.playTone(587.33, 'sine', 0.2, 0.1, 100);
      this.initArea(obj.targetArea);
      return;
    }

    if (obj.type === 'sign') {
      if (obj.id === 'snowman') {
        this.unlockAchievement('snowman_visit');
      }
      this.showDialogue('Lembrança Especial', obj.text, 'sign');
      return;
    }
  }

  talkToLuca() {
    // Vira o Luca de frente para a Bianca
    if (this.player.x > this.luca.x) this.luca.dir = 'right';
    else if (this.player.x < this.luca.x) this.luca.dir = 'left';
    else if (this.player.y > this.luca.y) this.luca.dir = 'down';
    else this.luca.dir = 'up';

    sound.playPetHeart();
    this.addHeart(this.luca.x + 8, this.luca.y);

    const lucaReplies = [
      'Mais do que tudo nesse mundo, minha loirinha! Amo mais do que brigadeiro e sushi juntos! Você é o amor da minha vida.',
      'Amo com toda a minha alma! Cada segundo desses 3 anos ao seu lado foi o melhor da minha história.',
      'Você ainda pergunta, meu dengo? Te amo daqui até a Cordilheira dos Andes e de volta!',
      'Mais que ontem e muito menos que amanhã! Você é a mulher mais linda e maravilhosa do mundo inteiro. ❤️',
      'Te amo infinitamente, minha companheira de todas as horas, de viagens, de cozinhar massa e de dançar na chuva!'
    ];
    const reply = lucaReplies[Math.floor(Math.random() * lucaReplies.length)];

    const dialogs = [
      {
        speaker: 'Bianca',
        avatar: 'bianca',
        text: 'Luca... você me ama? 🥺❤️'
      },
      {
        speaker: 'Luca',
        avatar: 'luca',
        text: reply
      }
    ];

    this.startDialogueQueue(dialogs);
  }

  // ==========================================
  // NOVAS MECÂNICAS: BEIJINHO, ALIMENTAR & MÃOS
  // ==========================================
  triggerKiss() {
    sound.init();
    sound.playKiss();
    this.kissCount++;

    // Aproxima o Luca carinhosamente da Bianca
    const angle = Math.atan2(this.player.y - this.luca.y, this.player.x - this.luca.x);
    this.luca.x = this.player.x - Math.cos(angle) * 16;
    this.luca.y = this.player.y - Math.sin(angle) * 16;

    this.luca.dir = this.player.x > this.luca.x ? 'right' : 'left';
    this.player.dir = this.player.x > this.luca.x ? 'left' : 'right';

    // Explosão circular de beijinhos e corações
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      const dist = 14 + Math.random() * 18;
      this.floatingTexts.push({
        x: (this.player.x + this.luca.x) / 2 + Math.cos(a) * dist + 8,
        y: (this.player.y + this.luca.y) / 2 + Math.sin(a) * dist,
        text: Math.random() < 0.5 ? '💋' : '💖',
        life: 1.4,
        scale: 1.1
      });
    }

    this.addFloatingText(this.player.x, this.player.y - 14, 'Beijinho no Luca! 💋', '#FF7096');
    this.speedBoostTimer = 4.0; // Boost com calor do beijinho!

    const phrases = [
      'Meu coração dispara toda vez que você me beija! Te amo infinitamente! ❤️',
      '3 anos e cada beijo seu ainda parece o primeiro da nossa vida!',
      'Você é a mulher mais perfeita do universo, minha loirinha dos olhos pretos! 🥰',
      'Mais doce que todos os brigadeiros do mundo! Te amo além da conta! 💕'
    ];
    const chosen = phrases[Math.floor(Math.random() * phrases.length)];

    this.startDialogueQueue([
      {
        speaker: 'Bianca & Luca',
        avatar: 'bianca',
        text: '*Smack!* Um beijinho apaixonado e quentinho no meio da aventura! 💋✨'
      },
      {
        speaker: 'Luca',
        avatar: 'luca',
        text: chosen
      }
    ]);

    if (this.kissCount >= 3) {
      this.unlockAchievement('kiss_3');
    }
  }

  triggerFeedPet() {
    sound.init();
    // Encontra o pet mais próximo
    let closestPet = null;
    let minDist = 48;
    for (const pet of this.pets) {
      const dist = Math.hypot(this.player.x - pet.x, this.player.y - pet.y);
      if (dist < minDist) {
        closestPet = pet;
        minDist = dist;
      }
    }

    if (!closestPet) {
      this.addFloatingText(this.player.x, this.player.y - 12, 'Chegue perto da Zara ou Jully! 🐾', '#FFD700');
      return;
    }

    sound.playFeed();
    sound.playBark(closestPet.type === 'zara');
    closestPet.jumpTimer = 1.4; // Ativa pulinhos de alegria

    // Partículas de petisco e corações
    for (let i = 0; i < 6; i++) {
      this.floatingTexts.push({
        x: closestPet.x + Math.random() * 16,
        y: closestPet.y - 6 + Math.random() * 10,
        text: Math.random() < 0.5 ? '🍣' : '❤️',
        life: 1.2,
        scale: 1
      });
    }

    this.addFloatingText(closestPet.x, closestPet.y - 14, '+1 Petisco com Amor! 🍖', '#FFD700');

    if (closestPet.type === 'zara') {
      this.fedZara = true;
      this.unlockAchievement('zara_love');
      this.showDialogue(
        'Zara',
        'Snort snort! *A Zara abocanhou o docinho alegremente, deu pulinhos desajeitados e deitou de barriguinha branca pra cima pedindo mais carinho!*',
        'zara'
      );
    } else {
      this.fedJully = true;
      this.unlockAchievement('jully_love');
      this.showDialogue(
        'Jully',
        'Au au au! *A Jully mastigou tudinho rebolando o rabinho com o lacinho rosa e te deu um montão de lambeijinhos na mão!*',
        'jully'
      );
    }
  }

  toggleHoldHands() {
    sound.init();
    this.isHoldingHands = !this.isHoldingHands;
    if (this.isHoldingHands) {
      sound.playHandHold();
      this.addFloatingText(this.player.x, this.player.y - 14, '🤝 De mãos dadas com Luca!', '#FF7597');
      this.unlockAchievement('hand_hold');
    } else {
      this.addFloatingText(this.player.x, this.player.y - 14, 'Soltando as mãos ✨', '#A6B0C3');
    }
  }

  triggerGiveBouquet() {
    sound.init();
    if (this.roseCount < 3) {
      sound.playTone(300, 'triangle', 0.1, 0.08, -50);
      this.addFloatingText(this.player.x, this.player.y - 14, `Colete 3 Rosas pelo jardim! (${this.roseCount}/3 🌹)`, '#FF4D7E');
      return;
    }

    sound.playBouquet();
    this.gaveBouquet = true;
    this.unlockAchievement('bouquet_love');

    // Vira o Luca de frente para Bianca
    this.luca.dir = this.player.x > this.luca.x ? 'right' : 'left';
    this.player.dir = this.player.x > this.luca.x ? 'left' : 'right';

    // Chuva de flores e corações
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      const dist = 16 + Math.random() * 24;
      this.floatingTexts.push({
        x: (this.player.x + this.luca.x) / 2 + Math.cos(a) * dist + 8,
        y: (this.player.y + this.luca.y) / 2 + Math.sin(a) * dist,
        text: Math.random() < 0.5 ? '🌹' : '💖',
        life: 1.6,
        scale: 1.2
      });
    }

    this.addFloatingText(this.player.x, this.player.y - 16, '🌹 Buquê Entregue com Todo Amor!', '#FF4D7E');

    this.startDialogueQueue([
      {
        speaker: 'Bianca',
        avatar: 'bianca',
        text: 'Luca, colhi essas rosas lindas para você! Feliz 3 anos, meu amor! 🌹❤️'
      },
      {
        speaker: 'Luca',
        avatar: 'luca',
        text: '*Olhos brilhando de emoção* Bianca... Que buquê mais maravilhoso! Você é o maior presente de toda a minha vida. Te amo para todo o sempre, minha loirinha!'
      }
    ]);
  }

  // ==========================================
  // SISTEMA DO ÁLBUM DE FOTOS (11 FOTOS REAIS)
  // ==========================================
  unlockPhoto(photoId) {
    const photo = this.photos.find(p => p.id === photoId);
    if (!photo) return;

    sound.playPhotoSnap();
    const isNew = !this.unlockedPhotos[photoId];
    this.unlockedPhotos[photoId] = true;
    this.saveUnlockedPhotos();

    // Se é uma foto marco dos anos (ano1, ano2, ano3), atualiza memória
    if (photo.year && !this.memoriesCollected[photo.year]) {
      this.memoriesCollected[photo.year] = true;
      this.updateMemoryBadgeUI();
    }

    // Corações flutuantes e texto
    for (let i = 0; i < 8; i++) {
      this.addHeart(this.player.x - 20 + Math.random() * 40, this.player.y - 20 + Math.random() * 40);
    }
    this.addFloatingText(this.player.x, this.player.y - 18, isNew ? '📸 Nova Foto Descoberta!' : '📸 Foto Relembrada!', '#FFD700');

    // Conquistas fotográficas
    const count = Object.keys(this.unlockedPhotos).length;
    if (count >= 5) this.unlockAchievement('photos_5');
    if (count >= 11) this.unlockAchievement('all_photos');

    // Exibe o modal Polaroid em destaque
    this.showMemoryModal({
      title: photo.title,
      img: photo.src,
      desc: photo.desc
    });

    this.updateAlbumUI();
  }

  unlockAllPhotos() {
    this.photos.forEach(p => {
      this.unlockedPhotos[p.id] = true;
      if (p.year) this.memoriesCollected[p.year] = true;
    });
    this.saveUnlockedPhotos();
    this.updateMemoryBadgeUI();
    this.updateAlbumUI();
    this.unlockAchievement('all_photos');
    sound.playFanfare();
    this.addFloatingText(this.player.x, this.player.y - 20, '✨ Todas as Fotos Reveladas! ✨', '#FFD700');
    this.renderAlbumModalGrid();
  }

  loadUnlockedPhotos() {
    const saved = localStorage.getItem('bianca_luca_photos');
    if (saved) {
      try {
        this.unlockedPhotos = JSON.parse(saved);
      } catch (e) {
        this.unlockedPhotos = {};
      }
    }
  }

  saveUnlockedPhotos() {
    localStorage.setItem('bianca_luca_photos', JSON.stringify(this.unlockedPhotos));
    this.updateAlbumUI();
  }

  openAlbumModal() {
    sound.init();
    sound.playTone(659.25, 'sine', 0.1, 0.1);
    this.renderAlbumModalGrid();
    const modal = document.getElementById('album-modal');
    if (modal) modal.classList.add('active');
  }

  renderAlbumModalGrid() {
    const grid = document.getElementById('album-modal-grid');
    const countText = document.getElementById('album-modal-count-text');
    const fill = document.getElementById('album-progress-fill');
    if (!grid) return;

    grid.innerHTML = '';
    const unlockedCount = Object.keys(this.unlockedPhotos).length;
    const total = this.photos.length;

    if (countText) {
      countText.innerText = `${unlockedCount} de ${total} Fotos Reveladas`;
    }
    if (fill) {
      fill.style.width = `${Math.round((unlockedCount / total) * 100)}%`;
    }

    this.photos.forEach(photo => {
      const isUnlocked = !!this.unlockedPhotos[photo.id];
      const card = document.createElement('div');
      card.className = `album-item-card ${isUnlocked ? 'unlocked' : 'locked'}`;

      if (isUnlocked) {
        card.innerHTML = `
          <div class="album-item-img-wrap">
            <img src="${photo.src}" alt="${photo.title}">
            <span class="zoom-badge">🔍 Clique para tela cheia</span>
          </div>
          <div class="album-item-body">
            <div>
              <h4>${photo.title} ✨</h4>
              <p>${photo.desc}</p>
            </div>
            <span class="album-item-location">📍 ${photo.location}</span>
          </div>
        `;
        card.addEventListener('click', () => {
          this.openLightbox(photo.title, photo.src, photo.desc);
        });
      } else {
        card.innerHTML = `
          <div class="album-item-img-wrap">
            <div class="album-lock-placeholder">
              <span class="lock-icon">🔒</span>
              <span>Memória Oculta</span>
            </div>
          </div>
          <div class="album-item-body">
            <div>
              <h4>??? (Ainda não descoberta)</h4>
              <p>💡 <em>${photo.hint}</em></p>
            </div>
            <span class="album-item-location">📍 ${photo.location}</span>
          </div>
        `;
      }
      grid.appendChild(card);
    });

    this.updateAlbumUI();
  }

  openLightbox(title, src, desc) {
    const modal = document.getElementById('lightbox-modal');
    const img = document.getElementById('lightbox-img');
    const titleEl = document.getElementById('lightbox-title');
    const descEl = document.getElementById('lightbox-desc');
    if (modal && img && titleEl && descEl) {
      img.src = src;
      titleEl.innerText = title;
      descEl.innerText = desc;
      modal.classList.add('active');
    }
  }

  updateAlbumUI() {
    const count = Object.keys(this.unlockedPhotos).length;
    const counterBadge = document.getElementById('album-counter');
    if (counterBadge) counterBadge.innerText = count;
  }

  // ==========================================
  // SISTEMA DE CONQUISTAS
  // ==========================================
  initAchievements() {
    this.achievements = {
      start_game: {
        id: 'start_game',
        title: 'O Começo de Tudo',
        desc: 'Começou a jornada pelos 3 Anos de Amor!',
        icon: '🌸',
        unlocked: true
      },
      kiss_3: {
        id: 'kiss_3',
        title: 'Chuva de Amor',
        desc: 'Deu 3 beijinhos apaixonados no Luca!',
        icon: '💋',
        unlocked: false
      },
      zara_love: {
        id: 'zara_love',
        title: 'Mimo da Zara',
        desc: 'Alimentou e fez carinho na Zara!',
        icon: '🐶',
        unlocked: false
      },
      jully_love: {
        id: 'jully_love',
        title: 'Chamego da Jully',
        desc: 'Alimentou e fez carinho na Jully!',
        icon: '🎀',
        unlocked: false
      },
      hand_hold: {
        id: 'hand_hold',
        title: 'Juntinhos Sempre',
        desc: 'Andou de mãos dadas com o Luca!',
        icon: '🤝',
        unlocked: false
      },
      bouquet_love: {
        id: 'bouquet_love',
        title: 'Buquê Apaixonado',
        desc: 'Presenteou o Luca com um lindo buquê de rosas!',
        icon: '🌹',
        unlocked: false
      },
      photos_5: {
        id: 'photos_5',
        title: 'Fotógrafa do Amor',
        desc: 'Descobriu 5 fotos reais no jogo!',
        icon: '📸',
        unlocked: false
      },
      all_photos: {
        id: 'all_photos',
        title: 'Álbum Completo dos 3 Anos',
        desc: 'Descobriu todas as 11 fotos reais do casal!',
        icon: '✨',
        unlocked: false
      },
      letters_love: {
        id: 'letters_love',
        title: 'Mensagens do Coração',
        desc: 'Leu todas as 3 cartinhas de amor secretas!',
        icon: '💌',
        unlocked: false
      },
      pool_splash: {
        id: 'pool_splash',
        title: 'Noite na Piscina',
        desc: 'Fez marolas na piscina sob as estrelas no Ano 3!',
        icon: '🏊‍♀️',
        unlocked: false
      },
      all_sushi: {
        id: 'all_sushi',
        title: 'Sushi Lover',
        desc: 'Coletou 3 sushis deliciosos!',
        icon: '🍣',
        unlocked: false
      },
      all_brigadeiro: {
        id: 'all_brigadeiro',
        title: 'Formiguinha Doce',
        desc: 'Coletou 3 brigadeiros amados!',
        icon: '🍫',
        unlocked: false
      },
      snowman_visit: {
        id: 'snowman_visit',
        title: 'Aventura no Chile',
        desc: 'Descobriu o boneco de neve em Valle Nevado!',
        icon: '⛄',
        unlocked: false
      },
      final_chest: {
        id: 'final_chest',
        title: 'Para Sempre Nós',
        desc: 'Abriu o Grande Baú Dourado dos 3 Anos!',
        icon: '👑',
        unlocked: false
      }
    };

    this.loadAchievements();
  }

  loadAchievements() {
    const saved = localStorage.getItem('bianca_luca_achievements');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        for (const id in data) {
          if (this.achievements[id]) {
            this.achievements[id].unlocked = data[id];
          }
        }
      } catch (e) {
        console.warn('Erro ao carregar conquistas:', e);
      }
    }
    this.updateAchievementsCountUI();
  }

  saveAchievements() {
    const data = {};
    for (const id in this.achievements) {
      data[id] = this.achievements[id].unlocked;
    }
    localStorage.setItem('bianca_luca_achievements', JSON.stringify(data));
    this.updateAchievementsCountUI();
  }

  unlockAchievement(id) {
    if (this.achievements[id] && !this.achievements[id].unlocked) {
      this.achievements[id].unlocked = true;
      this.saveAchievements();
      sound.playAchievement();
      this.showAchievementToast(this.achievements[id]);
    }
  }

  updateAchievementsCountUI() {
    let unlocked = 0;
    const total = Object.keys(this.achievements).length;
    for (const id in this.achievements) {
      if (this.achievements[id].unlocked) unlocked++;
    }
    const el = document.getElementById('achievements-count');
    const elTotal = document.getElementById('achievements-total');
    if (el) el.innerText = unlocked;
    if (elTotal) elTotal.innerText = total;
  }

  showAchievementToast(ach) {
    const toast = document.getElementById('achievement-toast');
    const desc = document.getElementById('toast-desc');
    if (toast && desc) {
      desc.innerText = `${ach.icon} ${ach.title}: ${ach.desc}`;
      toast.classList.add('show');
      clearTimeout(this.toastTimeout);
      this.toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
      }, 4500);
    }
  }

  openAchievementsModal() {
    const modal = document.getElementById('achievements-modal');
    const grid = document.getElementById('achievements-grid');
    const fill = document.getElementById('achievements-progress-fill');
    if (!modal || !grid) return;

    grid.innerHTML = '';
    let unlockedCount = 0;
    const total = Object.keys(this.achievements).length;

    for (const key in this.achievements) {
      const ach = this.achievements[key];
      if (ach.unlocked) unlockedCount++;

      const card = document.createElement('div');
      card.className = `achievement-card ${ach.unlocked ? 'unlocked' : ''}`;
      card.innerHTML = `
        <div class="icon-box">${ach.unlocked ? ach.icon : '🔒'}</div>
        <div class="card-text">
          <h4>${ach.title} ${ach.unlocked ? '✨' : ''}</h4>
          <p>${ach.desc}</p>
        </div>
      `;
      grid.appendChild(card);
    }

    if (fill) {
      const pct = Math.round((unlockedCount / total) * 100);
      fill.style.width = `${pct}%`;
    }

    modal.classList.add('active');
  }

  unlockMemory(year) {
    sound.playMemoryUnlock();
    this.memoriesCollected[year] = true;
    this.updateMemoryBadgeUI();

    let memoryData = { year };
    if (year === 1) {
      memoryData.title = 'Ano 1: O Começo do Nosso "Para Sempre" 🌿';
      memoryData.img = 'assets/fotos/ano1.jpg?v=3';
      memoryData.desc = 'Cercados pela natureza e folhagens tropicais... Você deslumbrante de vestido preto e eu fazendo o pedido mais certeiro e feliz da minha vida!';
    } else if (year === 2) {
      memoryData.title = 'Ano 2: Nossa Viagem Inesquecível ao Chile ❄️';
      memoryData.img = 'assets/fotos/ano2.jpg?v=3';
      memoryData.desc = 'Aquele beijo no mirante com toda a cidade e a Cordilheira dos Andes ao fundo! Conhecendo a neve juntos, rindo no frio e nos aquecendo com o nosso amor!';
    } else if (year === 3) {
      memoryData.title = 'Ano 3: Nosso Lar & Piscina Sob as Estrelas ✨';
      memoryData.img = 'assets/fotos/ano3.jpg?v=3';
      memoryData.desc = 'Nós dois de branco juntinhos na piscina iluminada com luzinhas ao luar, celebrando cada conquista e os 3 anos mais felizes da minha existência!';
    }

    this.showMemoryModal(memoryData);
  }

  openFinalChest() {
    const total = Object.values(this.memoriesCollected).filter(Boolean).length;
    if (total < 3) {
      this.showDialogue(
        'Baú dos 3 Anos de Amor',
        `O baú dourado está quase se abrindo! Você já encontrou ${total} de 3 Memórias. Visite os cenários do Ano 1 e Ano 2 para encontrar todas! ✨`,
        'chest'
      );
    } else {
      // TODAS AS MEMÓRIAS FORAM COLETADAS! CLÍMAX FINAL!
      sound.playFanfare();
      this.unlockAchievement('final_chest');
      // Criar explosão de corações
      for (let i = 0; i < 20; i++) {
        this.addHeart(
          this.player.x - 40 + Math.random() * 80,
          this.player.y - 40 + Math.random() * 80
        );
      }
      this.showGalleryModal();
    }
  }

  updateMemoryBadgeUI() {
    for (let y = 1; y <= 3; y++) {
      const el = document.getElementById(`badge-year-${y}`);
      if (el) {
        if (this.memoriesCollected[y]) {
          el.classList.add('unlocked');
        } else {
          el.classList.remove('unlocked');
        }
      }
    }
  }

  showMemoryModal(data) {
    const modal = document.getElementById('memory-modal');
    const title = document.getElementById('memory-modal-title');
    const img = document.getElementById('memory-modal-img');
    const desc = document.getElementById('memory-modal-desc');

    if (modal && title && img && desc) {
      title.innerText = data.title;
      img.src = data.img;
      desc.innerText = data.desc;
      modal.classList.add('active');
    }
  }

  showGalleryModal() {
    const modal = document.getElementById('gallery-modal');
    if (modal) modal.classList.add('active');
  }

  showDialogue(speaker, text, avatar = 'bianca') {
    this.startDialogueQueue([{ speaker, text, avatar }]);
  }

  startDialogueQueue(queue) {
    this.dialogueQueue = [...queue];
    this.dialogueActive = true;
    this.nextDialogue();
  }

  nextDialogue() {
    if (this.dialogueQueue.length === 0) {
      this.dialogueActive = false;
      const box = document.getElementById('dialogue-box');
      if (box) box.classList.remove('active');
      return;
    }

    this.currentDialogue = this.dialogueQueue.shift();
    this.typewriterIndex = 0;
    this.typewriterTimer = 0;

    const box = document.getElementById('dialogue-box');
    const speakerEl = document.getElementById('dialogue-speaker');
    const textEl = document.getElementById('dialogue-text');
    const avatarEl = document.getElementById('dialogue-avatar');

    if (box && speakerEl && textEl && avatarEl) {
      box.classList.add('active');
      speakerEl.innerText = this.currentDialogue.speaker;
      textEl.innerText = '';

      // Atualizar foto/avatar pixel art do interlocutor
      avatarEl.className = 'dialogue-avatar ' + this.currentDialogue.avatar;
    }
  }

  updateDialogue(dt) {
    if (!this.dialogueActive || !this.currentDialogue) return;

    if (this.typewriterIndex < this.currentDialogue.text.length) {
      this.typewriterTimer += dt * 45; // velocidade de digitação
      if (this.typewriterTimer >= 1) {
        this.typewriterTimer = 0;
        this.typewriterIndex++;
        const textEl = document.getElementById('dialogue-text');
        if (textEl) {
          textEl.innerText = this.currentDialogue.text.substring(0, this.typewriterIndex);
        }
        if (this.typewriterIndex % 2 === 0) {
          sound.playTypewriter();
        }
      }
    }
  }

  // ==========================================
  // RENDERIZAÇÃO GRÁFICA NO CANVAS
  // ==========================================
  render() {
    this.ctx.clearRect(0, 0, this.V_WIDTH, this.V_HEIGHT);
    this.ctx.save();
    this.ctx.translate(-Math.floor(this.camera.x), -Math.floor(this.camera.y));

    // 1. Cenário de Fundo (Piso, grama/neve/deck, caminhos)
    this.renderEnvironment();

    // 2. Objetos e Decorações do Mapa
    this.renderMapObjects();

    // 3. Comidinhas Coletáveis (Sushi & Brigadeiro)
    this.renderCollectibles();

    // 4. Pets (Zara & Jully)
    this.renderPets();

    // 5. Personagens (Luca & Bianca) com profundidade Y
    const entities = [
      { type: 'luca', y: this.luca.y },
      { type: 'player', y: this.player.y }
    ];
    entities.sort((a, b) => a.y - b.y);

    entities.forEach(ent => {
      if (ent.type === 'player') {
        const sprite = sprites.getBiancaSprite(this.player.dir, this.player.frame);
        this.ctx.drawImage(sprite, Math.floor(this.player.x), Math.floor(this.player.y - 10));
      } else {
        const sprite = sprites.getLucaSprite(this.luca.dir, this.luca.frame);
        this.ctx.drawImage(sprite, Math.floor(this.luca.x), Math.floor(this.luca.y - 10));
      }
    });

    // Se estiver de mãos dadas, desenhar conexão com brilho suave
    if (this.isHoldingHands) {
      const midX = (this.player.x + this.luca.x) / 2 + 8;
      const midY = (this.player.y + this.luca.y) / 2 + 5;
      this.ctx.fillStyle = 'rgba(255, 117, 151, 0.9)';
      this.ctx.font = 'bold 9px monospace';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('💕', midX, midY);
    }

    // 6. Partículas e Efeitos de Clima (Pétalas / Neve / Estrelas)
    this.renderParticles();

    // 7. Textos e Corações Flutuantes
    this.renderFloatingTexts();

    // 8. Indicador de Interação (balãozinho "Pressione [E]" quando estiver perto)
    this.renderInteractionPrompts();

    this.ctx.restore();
  }

  renderEnvironment() {
    if (this.currentArea === 1) {
      // Gramado exuberante
      this.ctx.fillStyle = '#5A9E32';
      this.ctx.fillRect(0, 0, this.mapWidth, this.mapHeight);

      // Manchas de grama mais clara e flores
      this.ctx.fillStyle = '#6EBE3C';
      for (let x = 0; x < this.mapWidth; x += 32) {
        for (let y = 0; y < this.mapHeight; y += 32) {
          if ((x + y) % 64 === 0) {
            this.ctx.fillRect(x, y, 16, 16);
          }
        }
      }

      // Caminho de pedras rústicas até o restaurante
      this.ctx.fillStyle = '#D6C8AE';
      this.ctx.fillRect(60, 185, 480, 26);
      this.ctx.fillStyle = '#C2B093';
      for (let x = 70; x < 530; x += 24) {
        this.ctx.fillRect(x, 188, 14, 20);
      }

      // Riacho de água cristalina com ponte de madeira
      this.ctx.fillStyle = '#4BA3E3';
      this.ctx.fillRect(200, 0, 40, this.mapHeight);
      this.ctx.fillStyle = '#68C4F8';
      this.ctx.fillRect(210, 0, 15, this.mapHeight);

      // Ponte de madeira
      this.ctx.fillStyle = '#8B5A2B';
      this.ctx.fillRect(195, 180, 50, 36);
      this.ctx.fillStyle = '#5C3818';
      this.ctx.fillRect(195, 180, 50, 3);
      this.ctx.fillRect(195, 213, 50, 3);

    } else if (this.currentArea === 2) {
      // Neve Branca Fofa dos Andes
      this.ctx.fillStyle = '#EBF4FA';
      this.ctx.fillRect(0, 0, this.mapWidth, this.mapHeight);

      // Relevo de gelo / neve brilhante
      this.ctx.fillStyle = '#D4E6F1';
      for (let x = 0; x < this.mapWidth; x += 40) {
        this.ctx.fillRect(x, (x * 3) % this.mapHeight, 30, 8);
      }

      // Pista de Esqui / Caminho de Neve batida
      this.ctx.fillStyle = '#F4FAFE';
      this.ctx.fillRect(40, 180, 520, 35);
      this.ctx.fillStyle = '#D0E3F0';
      this.ctx.fillRect(40, 180, 520, 2);
      this.ctx.fillRect(40, 215, 520, 2);

      // Pegadas na neve no Chile
      this.footprints.forEach(fp => {
        this.ctx.fillStyle = `rgba(180, 205, 230, ${fp.alpha})`;
        this.ctx.fillRect(fp.x, fp.y, 4, 3);
        this.ctx.fillRect(fp.x + 3, fp.y + 2, 4, 3);
      });

    } else if (this.currentArea === 3) {
      // Gramado Noturno Escuro
      this.ctx.fillStyle = '#1A2938';
      this.ctx.fillRect(0, 0, this.mapWidth, this.mapHeight);

      // Deck de Madeira Rústico
      this.ctx.fillStyle = '#6E4728';
      this.ctx.fillRect(180, 150, 360, 170);
      this.ctx.fillStyle = '#53351C';
      for (let y = 150; y < 320; y += 14) {
        this.ctx.fillRect(180, y, 360, 1);
      }

      // A LINDA PISCINA ILUMINADA
      this.ctx.fillStyle = '#0E6B88';
      this.ctx.fillRect(60, 60, 170, 100);
      this.ctx.fillStyle = '#1499BF';
      this.ctx.fillRect(65, 65, 160, 90);

      // Reflexo da água e brilho da lua
      this.ctx.fillStyle = '#39C5EB';
      const wave = Math.sin(performance.now() / 400) * 4;
      this.ctx.fillRect(75 + wave, 75, 50, 6);
      this.ctx.fillRect(130 - wave, 110, 60, 6);

      // Boia de Coração Rosa na piscina
      this.ctx.fillStyle = '#FF4D7E';
      this.ctx.fillRect(110 + wave, 95, 14, 12);
      this.ctx.fillStyle = '#1499BF';
      this.ctx.fillRect(114 + wave, 99, 6, 4);

      // Marolinhas interativas na piscina
      this.waterRipples.forEach(r => {
        this.ctx.strokeStyle = `rgba(255, 255, 255, ${r.alpha * 0.75})`;
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.ellipse(r.x, r.y, r.radius, r.radius * 0.5, 0, 0, Math.PI * 2);
        this.ctx.stroke();
      });

      // Varal de Luzinhas (Fairy Lights) penduradas no deck
      this.ctx.strokeStyle = '#D4AF37';
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.moveTo(180, 140);
      this.ctx.quadraticCurveTo(360, 165, 540, 140);
      this.ctx.stroke();

      // Lâmpadas brilhantes quentes
      for (let x = 200; x <= 520; x += 32) {
        const bulbY = 140 + Math.sin((x - 180) / 360 * Math.PI) * 20;
        this.ctx.fillStyle = '#FFF275';
        this.ctx.beginPath();
        this.ctx.arc(x, bulbY, 3, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }
  }

  drawPhotoMarker(x, y, isUnlocked) {
    const bob = Math.sin(performance.now() / 250) * 3;
    const marker = sprites.getPhotoMarkerSprite(isUnlocked);
    this.ctx.drawImage(marker, Math.floor(x - 10), Math.floor(y - 22 + bob));

    // Aura pulsante
    const pulse = 0.5 + 0.5 * Math.sin(performance.now() / 300);
    this.ctx.fillStyle = isUnlocked ? `rgba(255, 77, 126, ${pulse * 0.35})` : `rgba(49, 130, 206, ${pulse * 0.4})`;
    this.ctx.beginPath();
    this.ctx.arc(Math.floor(x), Math.floor(y - 12 + bob), 12, 0, Math.PI * 2);
    this.ctx.fill();
  }

  drawSecretLetter(x, y) {
    const bob = Math.sin(performance.now() / 280 + x) * 2;
    const letter = sprites.getLetterSprite();
    this.ctx.drawImage(letter, Math.floor(x), Math.floor(y + bob));

    const pulse = 0.4 + 0.6 * Math.sin(performance.now() / 320);
    this.ctx.fillStyle = `rgba(255, 215, 0, ${pulse * 0.3})`;
    this.ctx.beginPath();
    this.ctx.arc(Math.floor(x + 8), Math.floor(y + 8 + bob), 10, 0, Math.PI * 2);
    this.ctx.fill();
  }

  renderMapObjects() {
    if (this.currentArea === 1) {
      // Árvores Frondosas e Flores
      this.drawTree(80, 80);
      this.drawTree(140, 60);
      this.drawTree(400, 70);
      this.drawTree(460, 90);
      this.drawTree(100, 310);
      this.drawTree(450, 300);

      // Foto 1: Mesa Romântica do Pedido
      const f1 = this.interactables.find(i => i.id === 'photo_ano1');
      if (f1) {
        this.ctx.fillStyle = '#8B5A2B';
        this.ctx.fillRect(f1.x, f1.y, 36, 24);
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(f1.x + 4, f1.y + 2, 28, 20);
        this.ctx.fillStyle = '#FF4D7E';
        this.ctx.fillRect(f1.x + 10, f1.y + 6, 4, 6);
        this.ctx.fillRect(f1.x + 22, f1.y + 6, 4, 6);
        this.drawPhotoMarker(f1.x + 18, f1.y, !!this.unlockedPhotos['ano1']);
      }

      // Foto 2: Bancada de Macarrão Artesanal & Aperol Spritz (massa)
      const f2 = this.interactables.find(i => i.id === 'photo_massa');
      if (f2) {
        const sprite = sprites.getPastaStationSprite();
        this.ctx.drawImage(sprite, f2.x, f2.y);
        this.drawPhotoMarker(f2.x + 16, f2.y, !!this.unlockedPhotos['massa']);
      }

      // Foto 3: Píer do Lago com Pôr do Sol (pordosol)
      const f3 = this.interactables.find(i => i.id === 'photo_pordosol');
      if (f3) {
        const sprite = sprites.getPierSunsetSprite();
        this.ctx.drawImage(sprite, f3.x, f3.y);
        this.drawPhotoMarker(f3.x + 15, f3.y, !!this.unlockedPhotos['pordosol']);
      }

      // Foto 4: Banco dos Namorados sob Flores (abraco)
      const f4 = this.interactables.find(i => i.id === 'photo_abraco');
      if (f4) {
        const sprite = sprites.getCoupleBenchSprite();
        this.ctx.drawImage(sprite, f4.x, f4.y);
        this.drawPhotoMarker(f4.x + 14, f4.y, !!this.unlockedPhotos['abraco']);
      }

      // Cartinha Secreta 1
      const l1 = this.interactables.find(i => i.id === 'letter_1');
      if (l1) {
        this.drawSecretLetter(l1.x, l1.y);
      }

      // Portal do Ano 2 (Arco de Flores)
      const portal = this.interactables.find(i => i.id === 'portal_to_2');
      if (portal) {
        this.drawFlowerArch(portal.x, portal.y);
      }

    } else if (this.currentArea === 2) {
      // Pinheiros Cobertos de Neve
      this.drawSnowPine(60, 90);
      this.drawSnowPine(130, 70);
      this.drawSnowPine(420, 80);
      this.drawSnowPine(500, 100);
      this.drawSnowPine(90, 300);
      this.drawSnowPine(460, 290);

      // Chalé de Montanha
      this.drawCabin(260, 70);

      // Boneco de neve
      const snowman = this.interactables.find(i => i.id === 'snowman');
      if (snowman) {
        this.drawSnowman(snowman.x, snowman.y);
      }

      // Foto 5: Esquis & Mirante de Valle Nevado (ano2)
      const f5 = this.interactables.find(i => i.id === 'photo_ano2');
      if (f5) {
        this.ctx.fillStyle = '#E53E3E';
        this.ctx.fillRect(f5.x + 6, f5.y + 4, 3, 22);
        this.ctx.fillStyle = '#3182CE';
        this.ctx.fillRect(f5.x + 14, f5.y + 4, 3, 22);
        this.drawPhotoMarker(f5.x + 12, f5.y, !!this.unlockedPhotos['ano2']);
      }

      // Foto 6: Sombreros Mexicanos Festivos (mexicano)
      const f6 = this.interactables.find(i => i.id === 'photo_mexicano');
      if (f6) {
        const sprite = sprites.getSombreroSprite();
        this.ctx.drawImage(sprite, f6.x, f6.y);
        this.drawPhotoMarker(f6.x + 14, f6.y, !!this.unlockedPhotos['mexicano']);
      }

      // Foto 7: Tapete Vermelho & Noite de Gala (gala)
      const f7 = this.interactables.find(i => i.id === 'photo_gala');
      if (f7) {
        const sprite = sprites.getGalaArchSprite();
        this.ctx.drawImage(sprite, f7.x, f7.y);
        this.drawPhotoMarker(f7.x + 16, f7.y, !!this.unlockedPhotos['gala']);
      }

      // Foto 8: Abóbora Iluminada de Halloween (halloween1)
      const f8 = this.interactables.find(i => i.id === 'photo_halloween1');
      if (f8) {
        const sprite = sprites.getPumpkinSprite();
        this.ctx.drawImage(sprite, f8.x, f8.y);
        this.drawPhotoMarker(f8.x + 11, f8.y, !!this.unlockedPhotos['halloween1']);
      }

      // Foto 9: Caldeirão Mágico de Halloween (halloween2)
      const f9 = this.interactables.find(i => i.id === 'photo_halloween2');
      if (f9) {
        const sprite = sprites.getHalloweenCauldronSprite();
        this.ctx.drawImage(sprite, f9.x, f9.y);
        this.drawPhotoMarker(f9.x + 12, f9.y, !!this.unlockedPhotos['halloween2']);
      }

      // Cartinha Secreta 2
      const l2 = this.interactables.find(i => i.id === 'letter_2');
      if (l2) {
        this.drawSecretLetter(l2.x, l2.y);
      }

      // Portal de saída
      const portal = this.interactables.find(i => i.id === 'portal_to_3');
      if (portal) {
        this.drawIceArch(portal.x, portal.y);
      }

    } else if (this.currentArea === 3) {
      // Foto 10: Mesa de Jantar Noturno (ano3)
      const f10 = this.interactables.find(i => i.id === 'photo_ano3');
      if (f10) {
        this.ctx.fillStyle = '#8B5A2B';
        this.ctx.fillRect(f10.x, f10.y, 44, 26);
        this.ctx.fillStyle = '#5A3515';
        this.ctx.fillRect(f10.x + 6, f10.y + 6, 12, 4);
        this.ctx.fillStyle = '#8B3E12';
        this.ctx.fillRect(f10.x + 8, f10.y + 5, 8, 6);
        this.ctx.fillStyle = '#E2B024';
        this.ctx.fillRect(f10.x + 24, f10.y + 4, 8, 8);
        this.ctx.fillStyle = '#D67D28';
        this.ctx.fillRect(f10.x + 16, f10.y + 14, 10, 6);
        this.drawPhotoMarker(f10.x + 22, f10.y, !!this.unlockedPhotos['ano3']);
      }

      // Foto 11: Penteadeira / Espelho de Selfie (selfie)
      const f11 = this.interactables.find(i => i.id === 'photo_selfie');
      if (f11) {
        const sprite = sprites.getVanityMirrorSprite();
        this.ctx.drawImage(sprite, f11.x, f11.y);
        this.drawPhotoMarker(f11.x + 12, f11.y, !!this.unlockedPhotos['selfie']);
      }

      // Cartinha Secreta 3
      const l3 = this.interactables.find(i => i.id === 'letter_3');
      if (l3) {
        this.drawSecretLetter(l3.x, l3.y);
      }

      // O BAÚ DOURADO DOS 3 ANOS
      const chestObj = this.interactables.find(i => i.id === 'chest_3');
      if (chestObj) {
        const isReady = Object.values(this.memoriesCollected).filter(Boolean).length === 3;
        const chestSprite = sprites.getChestSprite(isReady);
        this.ctx.drawImage(chestSprite, chestObj.x, chestObj.y);

        if (isReady) {
          const pulse = Math.abs(Math.sin(performance.now() / 300));
          this.ctx.fillStyle = `rgba(255, 215, 0, ${pulse * 0.4})`;
          this.ctx.beginPath();
          this.ctx.arc(chestObj.x + 12, chestObj.y + 10, 24, 0, Math.PI * 2);
          this.ctx.fill();
        }
      }
    }
  }

  drawTree(x, y) {
    // Tronco
    this.ctx.fillStyle = '#6E4522';
    this.ctx.fillRect(x + 10, y + 20, 8, 16);
    // Copa de folhas
    this.ctx.fillStyle = '#2E7D32';
    this.ctx.beginPath();
    this.ctx.arc(x + 14, y + 14, 18, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.fillStyle = '#388E3C';
    this.ctx.beginPath();
    this.ctx.arc(x + 12, y + 10, 14, 0, Math.PI * 2);
    this.ctx.fill();
    // Flores de cerejeira/rosas na árvore
    this.ctx.fillStyle = '#FF8DA1';
    this.ctx.fillRect(x + 6, y + 8, 3, 3);
    this.ctx.fillRect(x + 18, y + 12, 3, 3);
    this.ctx.fillRect(x + 12, y + 4, 3, 3);
  }

  drawSnowPine(x, y) {
    this.ctx.fillStyle = '#4E3629';
    this.ctx.fillRect(x + 8, y + 24, 6, 12);
    // Camadas de pinheiro
    this.ctx.fillStyle = '#1B4D3E';
    this.ctx.fillRect(x, y + 18, 22, 8);
    this.ctx.fillRect(x + 3, y + 10, 16, 8);
    this.ctx.fillRect(x + 6, y + 2, 10, 8);
    // Cobertura de neve
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fillRect(x, y + 18, 22, 3);
    this.ctx.fillRect(x + 3, y + 10, 16, 3);
    this.ctx.fillRect(x + 6, y + 2, 10, 3);
  }

  drawCabin(x, y) {
    // Paredes de madeira
    this.ctx.fillStyle = '#784212';
    this.ctx.fillRect(x, y + 16, 60, 34);
    // Telhado alpino coberto de neve
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.beginPath();
    this.ctx.moveTo(x - 6, y + 18);
    this.ctx.lineTo(x + 30, y - 4);
    this.ctx.lineTo(x + 66, y + 18);
    this.ctx.fill();
    // Porta e Janela acolhedora com luz amarela
    this.ctx.fillStyle = '#4E2608';
    this.ctx.fillRect(x + 24, y + 28, 14, 22);
    this.ctx.fillStyle = '#F9E79F';
    this.ctx.fillRect(x + 8, y + 24, 10, 10);
    this.ctx.fillRect(x + 42, y + 24, 10, 10);
    // Chaminé com fumaça
    this.ctx.fillStyle = '#566573';
    this.ctx.fillRect(x + 44, y - 2, 6, 12);
  }

  drawSnowman(x, y) {
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.beginPath();
    this.ctx.arc(x + 10, y + 16, 9, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.arc(x + 10, y + 6, 6, 0, Math.PI * 2);
    this.ctx.fill();
    // Cachecol Rosa
    this.ctx.fillStyle = '#FF4D7E';
    this.ctx.fillRect(x + 5, y + 10, 10, 3);
    // Nariz de cenoura
    this.ctx.fillStyle = '#E67E22';
    this.ctx.fillRect(x + 10, y + 6, 4, 2);
  }

  drawFlowerArch(x, y) {
    this.ctx.fillStyle = '#8B5A2B';
    this.ctx.fillRect(x, y, 4, 34);
    this.ctx.fillRect(x + 28, y, 4, 34);
    this.ctx.fillRect(x, y, 32, 5);
    // Rosas decorando
    this.ctx.fillStyle = '#FF4D7E';
    for (let i = 0; i < 32; i += 6) {
      this.ctx.fillRect(x + i, y - 2, 4, 4);
    }
  }

  drawIceArch(x, y) {
    this.ctx.fillStyle = '#A9CCE3';
    this.ctx.fillRect(x, y, 5, 34);
    this.ctx.fillRect(x + 27, y, 5, 34);
    this.ctx.fillStyle = '#D4E6F1';
    this.ctx.fillRect(x, y, 32, 6);
  }

  renderCollectibles() {
    this.collectibles.forEach(item => {
      if (!item.collected) {
        const bob = Math.sin(performance.now() / 200 + item.x) * 2;
        if (item.type === 'rose') {
          const sprite = sprites.getRoseSprite();
          this.ctx.drawImage(sprite, item.x, item.y + bob);
        } else if (item.type === 'sushi') {
          const sprite = sprites.getSushiSprite();
          this.ctx.drawImage(sprite, item.x, item.y + bob);
        } else {
          const sprite = sprites.getBrigadeiroSprite();
          this.ctx.drawImage(sprite, item.x, item.y + bob);
        }
      }
    });
  }

  renderPets() {
    this.pets.forEach(pet => {
      const jumpY = pet.jumpTimer > 0 ? -Math.abs(Math.sin(pet.jumpTimer * 12)) * 7 : 0;
      if (pet.type === 'zara') {
        const sprite = sprites.getZaraSprite(pet.frame);
        this.ctx.drawImage(sprite, pet.x, pet.y + jumpY);
      } else {
        const sprite = sprites.getJullySprite(pet.frame);
        this.ctx.drawImage(sprite, pet.x, pet.y + jumpY);
      }

      // Plaquinha com o nome da cachorrinha
      const tagText = pet.name === 'Zara' ? '🐶 Zara' : '🎀 Jully';
      this.ctx.font = 'bold 9px monospace';
      const textWidth = this.ctx.measureText(tagText).width;

      const tagX = Math.floor(pet.x + 10 - textWidth / 2);
      const tagY = Math.floor(pet.y + jumpY - 4);

      // Fundo suave
      this.ctx.fillStyle = 'rgba(15, 17, 26, 0.85)';
      this.ctx.fillRect(tagX - 3, tagY - 8, textWidth + 6, 11);

      // Borda temática
      this.ctx.strokeStyle = pet.name === 'Zara' ? '#ff7597' : '#ffd700';
      this.ctx.lineWidth = 1;
      this.ctx.strokeRect(tagX - 3, tagY - 8, textWidth + 6, 11);

      // Texto do nome
      this.ctx.fillStyle = '#ffffff';
      this.ctx.textAlign = 'left';
      this.ctx.fillText(tagText, tagX, tagY);
    });
  }

  renderParticles() {
    this.particles.forEach(p => {
      if (p.type === 'petal') {
        // Pétalas cor-de-rosa caindo
        this.ctx.fillStyle = `rgba(255, 140, 175, ${p.alpha})`;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (p.type === 'snow') {
        // Flocos de neve fofinhos
        this.ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (p.type === 'star') {
        // Vaga-lumes e estrelas cintilantes
        const pulse = 0.3 + 0.7 * Math.abs(Math.sin(p.pulse));
        this.ctx.fillStyle = `rgba(255, 240, 140, ${pulse})`;
        this.ctx.fillRect(p.x, p.y, p.size, p.size);
      }
    });
  }

  renderFloatingTexts() {
    this.floatingTexts.forEach(item => {
      this.ctx.font = 'bold 10px monospace';
      this.ctx.fillStyle = item.color || '#FFD700';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(item.text, item.x, item.y);
    });
  }

  renderInteractionPrompts() {
    let promptText = null;
    let targetX = 0;
    let targetY = 0;
    let actionIcon = '❤️';
    let actionLabel = 'AÇÃO';

    const px = this.player.x + 8;
    const py = this.player.y + 11;

    // 1. Interagíveis (Fotos, Baú, Cartinhas, Placas, Portais) com maior prioridade
    let closestObj = null;
    let minObjDist = 52;
    for (const obj of this.interactables) {
      const ox = obj.x + (obj.w || 24) / 2;
      const oy = obj.y + (obj.h || 24) / 2;
      const dist = Math.hypot(px - ox, py - oy);
      if (dist < minObjDist) {
        closestObj = obj;
        minObjDist = dist;
      }
    }

    if (closestObj) {
      promptText = closestObj.prompt;
      targetX = closestObj.x + (closestObj.w || 24) / 2;
      targetY = closestObj.y - 14;

      if (closestObj.type === 'photo') {
        actionIcon = '📸';
        actionLabel = 'FOTO';
      } else if (closestObj.type === 'chest') {
        actionIcon = '👑';
        actionLabel = 'BAÚ';
      } else if (closestObj.type === 'letter') {
        actionIcon = '💌';
        actionLabel = 'CARTA';
      } else if (closestObj.type === 'portal') {
        actionIcon = '✨';
        actionLabel = 'ENTRAR';
      }
    }

    // 2. Pets
    if (!promptText) {
      for (const pet of this.pets) {
        const dist = Math.hypot(px - (pet.x + 10), py - (pet.y + 10));
        if (dist < 42) {
          promptText = `[E] Carinho | [F] 🍖 Petisco na ${pet.name}`;
          targetX = pet.x + 8;
          targetY = pet.y - 8;
          actionIcon = '🐾';
          actionLabel = 'PET';
          break;
        }
      }
    }

    // 3. Luca (se não houver objetos próximos mais prioritários)
    if (!promptText) {
      const distToLuca = Math.hypot(px - (this.luca.x + 8), py - (this.luca.y + 11));
      if (distToLuca < 42) {
        promptText = '[E] Conversar | [B] 💋 Beijinho | [R] 🌹 Buquê | [H] 🤝 Mãos';
        targetX = this.luca.x + 8;
        targetY = this.luca.y - 14;
        actionIcon = '💬';
        actionLabel = 'LUCA';
      }
    }

    // Atualiza o botão touch na tela
    const btnIcon = document.getElementById('btn-action-icon');
    const btnText = document.getElementById('btn-action-text');
    if (btnIcon && btnText) {
      if (btnIcon.innerText !== actionIcon) btnIcon.innerText = actionIcon;
      if (btnText.innerText !== actionLabel) btnText.innerText = actionLabel;
    }

    if (promptText) {
      this.ctx.font = 'bold 9px monospace';
      const textWidth = this.ctx.measureText(promptText).width;

      this.ctx.fillStyle = 'rgba(15, 17, 26, 0.9)';
      this.ctx.strokeStyle = '#FF4D7E';
      this.ctx.lineWidth = 1;

      const boxX = targetX - textWidth / 2 - 6;
      const boxY = targetY - 11;
      const boxW = textWidth + 12;
      const boxH = 15;

      if (this.ctx.roundRect) {
        this.ctx.beginPath();
        this.ctx.roundRect(boxX, boxY, boxW, boxH, 4);
        this.ctx.fill();
        this.ctx.stroke();
      } else {
        this.ctx.fillRect(boxX, boxY, boxW, boxH);
        this.ctx.strokeRect(boxX, boxY, boxW, boxH);
      }

      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(promptText, targetX, targetY);
    }
  }
}
