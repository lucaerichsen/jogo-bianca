// Gerador de Sprites e Texturas em Pixel Art via Canvas
export class SpriteGenerator {
  constructor() {
    this.cache = new Map();
  }

  // Cria um canvas auxiliar
  createCanvas(w, h) {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    return { canvas, ctx };
  }

  // Desenha retângulos de pixels com precisão
  drawPixels(ctx, pixels, colorMap, scale = 1, offsetX = 0, offsetY = 0) {
    for (let r = 0; r < pixels.length; r++) {
      const row = pixels[r];
      for (let c = 0; c < row.length; c++) {
        const char = row[c];
        if (char !== '.' && colorMap[char]) {
          ctx.fillStyle = colorMap[char];
          ctx.fillRect(offsetX + c * scale, offsetY + r * scale, scale, scale);
        }
      }
    }
  }

  // ==========================================
  // SPRITES DA BIANCA (Loirinha, olhos pretos, ondulado, ama rosa)
  // ==========================================
  getBiancaSprite(dir = 'down', frame = 0) {
    const key = `bianca_${dir}_${frame}`;
    if (this.cache.has(key)) return this.cache.get(key);

    const { canvas, ctx } = this.createCanvas(24, 32);

    const colors = {
      // Pele
      S: '#FCE4D6', // pele clara
      s: '#F5C9B3', // sombra pele
      // Olhos
      E: '#1A1A1A', // olho preto
      W: '#FFFFFF', // brilho do olho
      // Cabelo Loiro Ondulado
      H: '#FDE482', // loiro claro
      h: '#E8C547', // loiro médio
      D: '#BF9820', // sombra loiro
      // Roupa Rosa
      P: '#FF7096', // rosa principal
      p: '#FF4D7E', // rosa sombra
      L: '#FFB3C6', // rosa claro / detalhe
      // Pernas / Sapatos
      B: '#FFFFFF', // meia/pele
      K: '#FF4D7E', // sapatinho rosa
      // Contorno / Linhas
      O: '#4A3B32'
    };

    // Variação de passo (frame 0 = neutro, 1 = perna esquerda, 2 = perna direita)
    let legOffsetL = 0;
    let legOffsetR = 0;
    let bob = 0;

    if (frame === 1) {
      legOffsetL = -1;
      legOffsetR = 1;
      bob = 1;
    } else if (frame === 2) {
      legOffsetL = 1;
      legOffsetR = -1;
      bob = 1;
    }

    const PADDING_TOP = 2 + (frame % 2 === 1 ? 1 : 0);

    if (dir === 'down') {
      // Cabelo de fundo (ondulações que caem nos ombros)
      ctx.fillStyle = colors.h;
      ctx.fillRect(4, PADDING_TOP + 6, 16, 12);
      ctx.fillRect(3, PADDING_TOP + 10, 18, 9);
      ctx.fillStyle = colors.D;
      ctx.fillRect(3, PADDING_TOP + 17, 4, 3);
      ctx.fillRect(17, PADDING_TOP + 17, 4, 3);

      // Rosto
      ctx.fillStyle = colors.S;
      ctx.fillRect(6, PADDING_TOP + 6, 12, 10);
      ctx.fillStyle = colors.s;
      ctx.fillRect(6, PADDING_TOP + 14, 12, 2);

      // Franja loira e cabelo superior
      ctx.fillStyle = colors.H;
      ctx.fillRect(5, PADDING_TOP + 2, 14, 6);
      ctx.fillRect(7, PADDING_TOP + 1, 10, 2);
      ctx.fillStyle = colors.h;
      ctx.fillRect(5, PADDING_TOP + 6, 4, 3);
      ctx.fillRect(15, PADDING_TOP + 6, 4, 3);

      // Olhos pretos marcantes
      ctx.fillStyle = colors.E;
      ctx.fillRect(8, PADDING_TOP + 9, 2, 3);
      ctx.fillRect(14, PADDING_TOP + 9, 2, 3);
      ctx.fillStyle = colors.W;
      ctx.fillRect(8, PADDING_TOP + 9, 1, 1);
      ctx.fillRect(14, PADDING_TOP + 9, 1, 1);

      // Bochechinhas rosadas
      ctx.fillStyle = '#FFAEC9';
      ctx.fillRect(7, PADDING_TOP + 12, 2, 1);
      ctx.fillRect(15, PADDING_TOP + 12, 2, 1);

      // Sorrisinho fofo
      ctx.fillStyle = colors.p;
      ctx.fillRect(11, PADDING_TOP + 13, 2, 1);

      // Vestidinho Rosa
      ctx.fillStyle = colors.P;
      ctx.fillRect(6, PADDING_TOP + 16, 12, 7);
      ctx.fillStyle = colors.L;
      // Gola / lacinho branco-rosa
      ctx.fillRect(10, PADDING_TOP + 16, 4, 2);
      ctx.fillStyle = colors.p;
      ctx.fillRect(5, PADDING_TOP + 21, 14, 3);

      // Bracinhos
      ctx.fillStyle = colors.S;
      ctx.fillRect(4, PADDING_TOP + 17, 2, 5);
      ctx.fillRect(18, PADDING_TOP + 17, 2, 5);

      // Pernas e sapatos
      ctx.fillStyle = colors.S;
      ctx.fillRect(8, PADDING_TOP + 24 + legOffsetL, 3, 4);
      ctx.fillRect(13, PADDING_TOP + 24 + legOffsetR, 3, 4);

      ctx.fillStyle = colors.K;
      ctx.fillRect(7, PADDING_TOP + 27 + legOffsetL, 4, 2);
      ctx.fillRect(13, PADDING_TOP + 27 + legOffsetR, 4, 2);

    } else if (dir === 'up') {
      // Cabelo loiro de costas, ondulado nas pontas
      ctx.fillStyle = colors.h;
      ctx.fillRect(5, PADDING_TOP + 2, 14, 16);
      ctx.fillStyle = colors.H;
      ctx.fillRect(7, PADDING_TOP + 1, 10, 10);
      ctx.fillRect(6, PADDING_TOP + 4, 12, 10);

      // Ondulações volumosas descendo
      ctx.fillStyle = colors.h;
      ctx.fillRect(4, PADDING_TOP + 10, 16, 9);
      ctx.fillStyle = colors.D;
      ctx.fillRect(3, PADDING_TOP + 14, 4, 6);
      ctx.fillRect(17, PADDING_TOP + 14, 4, 6);
      ctx.fillRect(9, PADDING_TOP + 16, 6, 4);

      // Laço rosa nas costas
      ctx.fillStyle = colors.p;
      ctx.fillRect(10, PADDING_TOP + 15, 4, 3);

      // Vestidinho
      ctx.fillStyle = colors.P;
      ctx.fillRect(6, PADDING_TOP + 18, 12, 6);
      ctx.fillStyle = colors.p;
      ctx.fillRect(5, PADDING_TOP + 21, 14, 3);

      // Pernas
      ctx.fillStyle = colors.S;
      ctx.fillRect(8, PADDING_TOP + 24 + legOffsetL, 3, 4);
      ctx.fillRect(13, PADDING_TOP + 24 + legOffsetR, 3, 4);
      ctx.fillStyle = colors.K;
      ctx.fillRect(8, PADDING_TOP + 27 + legOffsetL, 3, 2);
      ctx.fillRect(13, PADDING_TOP + 27 + legOffsetR, 3, 2);

    } else {
      // Esquerda ou Direita
      const isLeft = dir === 'left';
      ctx.save();
      if (isLeft) {
        ctx.translate(24, 0);
        ctx.scale(-1, 1);
      }

      // Cabelo lateral
      ctx.fillStyle = colors.h;
      ctx.fillRect(5, PADDING_TOP + 2, 12, 8);
      ctx.fillRect(4, PADDING_TOP + 8, 8, 11);
      ctx.fillStyle = colors.D;
      ctx.fillRect(3, PADDING_TOP + 14, 5, 6); // ponta ondulada

      // Rosto perfil
      ctx.fillStyle = colors.S;
      ctx.fillRect(9, PADDING_TOP + 6, 8, 9);
      ctx.fillStyle = colors.H;
      ctx.fillRect(7, PADDING_TOP + 2, 8, 5);
      ctx.fillRect(12, PADDING_TOP + 4, 4, 3);

      // Olho preto
      ctx.fillStyle = colors.E;
      ctx.fillRect(14, PADDING_TOP + 8, 2, 3);
      ctx.fillStyle = colors.W;
      ctx.fillRect(15, PADDING_TOP + 8, 1, 1);

      // Bochecha
      ctx.fillStyle = '#FFAEC9';
      ctx.fillRect(14, PADDING_TOP + 11, 2, 1);

      // Vestidinho
      ctx.fillStyle = colors.P;
      ctx.fillRect(8, PADDING_TOP + 16, 9, 7);
      ctx.fillStyle = colors.p;
      ctx.fillRect(7, PADDING_TOP + 21, 11, 3);

      // Bracinho
      ctx.fillStyle = colors.S;
      ctx.fillRect(10, PADDING_TOP + 17, 3, 5);

      // Pernas
      ctx.fillStyle = colors.S;
      ctx.fillRect(9, PADDING_TOP + 24 + legOffsetL, 3, 4);
      ctx.fillRect(13, PADDING_TOP + 24 + legOffsetR, 3, 4);
      ctx.fillStyle = colors.K;
      ctx.fillRect(9, PADDING_TOP + 27 + legOffsetL, 4, 2);
      ctx.fillRect(13, PADDING_TOP + 27 + legOffsetR, 4, 2);

      ctx.restore();
    }

    this.cache.set(key, canvas);
    return canvas;
  }

  // ==========================================
  // SPRITES DO LUCA (Loiro escuro, barba, óculos, olhos azuis claros, camisa branca)
  // ==========================================
  getLucaSprite(dir = 'down', frame = 0) {
    const key = `luca_${dir}_${frame}`;
    if (this.cache.has(key)) return this.cache.get(key);

    const { canvas, ctx } = this.createCanvas(24, 32);

    const colors = {
      S: '#FCE4D6', // pele
      s: '#F0C2A8', // sombra pele
      // Olhos azul claro
      E: '#38A3E5',
      W: '#FFFFFF',
      // Óculos armação escura
      G: '#22222B',
      // Cabelo Loiro Escuro
      H: '#9E783B',
      h: '#BD9652',
      D: '#705121',
      // Barba
      B: '#8B642C',
      b: '#6E4E20',
      // Roupa: Camiseta Branca + Calça Casual Escura
      T: '#FFFFFF',
      t: '#DCE1EB',
      P: '#2F3846', // calça azulada escura
      p: '#1E2430',
      K: '#4A3B32'  // tênis/sapato marrom
    };

    let legOffsetL = 0;
    let legOffsetR = 0;
    if (frame === 1) {
      legOffsetL = -1;
      legOffsetR = 1;
    } else if (frame === 2) {
      legOffsetL = 1;
      legOffsetR = -1;
    }

    const PADDING_TOP = 2;

    if (dir === 'down') {
      // Cabeça / Rosto
      ctx.fillStyle = colors.S;
      ctx.fillRect(6, PADDING_TOP + 6, 12, 10);

      // Cabelo loiro escuro estiloso
      ctx.fillStyle = colors.H;
      ctx.fillRect(5, PADDING_TOP + 2, 14, 5);
      ctx.fillRect(6, PADDING_TOP + 1, 12, 2);
      ctx.fillStyle = colors.h;
      ctx.fillRect(7, PADDING_TOP + 2, 9, 2);

      // Óculos com lentes e armação
      ctx.fillStyle = colors.G;
      ctx.fillRect(7, PADDING_TOP + 7, 4, 3);
      ctx.fillRect(13, PADDING_TOP + 7, 4, 3);
      ctx.fillRect(11, PADDING_TOP + 8, 2, 1); // ponte dos óculos

      // Olhos azuis claros por trás dos óculos
      ctx.fillStyle = colors.E;
      ctx.fillRect(8, PADDING_TOP + 8, 2, 2);
      ctx.fillRect(14, PADDING_TOP + 8, 2, 2);
      ctx.fillStyle = colors.W;
      ctx.fillRect(9, PADDING_TOP + 8, 1, 1);
      ctx.fillRect(15, PADDING_TOP + 8, 1, 1);

      // Barba estilosa
      ctx.fillStyle = colors.B;
      ctx.fillRect(6, PADDING_TOP + 12, 2, 4);
      ctx.fillRect(16, PADDING_TOP + 12, 2, 4);
      ctx.fillRect(8, PADDING_TOP + 14, 8, 2);
      ctx.fillRect(9, PADDING_TOP + 13, 6, 1); // bigode suave

      // Camiseta Branca
      ctx.fillStyle = colors.T;
      ctx.fillRect(6, PADDING_TOP + 16, 12, 8);
      ctx.fillStyle = colors.t;
      ctx.fillRect(6, PADDING_TOP + 22, 12, 2);

      // Braços
      ctx.fillStyle = colors.T;
      ctx.fillRect(4, PADDING_TOP + 16, 2, 4);
      ctx.fillRect(18, PADDING_TOP + 16, 2, 4);
      ctx.fillStyle = colors.S;
      ctx.fillRect(4, PADDING_TOP + 20, 2, 3);
      ctx.fillRect(18, PADDING_TOP + 20, 2, 3);

      // Calça casual
      ctx.fillStyle = colors.P;
      ctx.fillRect(7, PADDING_TOP + 24 + legOffsetL, 4, 5);
      ctx.fillRect(13, PADDING_TOP + 24 + legOffsetR, 4, 5);

      // Tênis
      ctx.fillStyle = colors.K;
      ctx.fillRect(7, PADDING_TOP + 28 + legOffsetL, 4, 2);
      ctx.fillRect(13, PADDING_TOP + 28 + legOffsetR, 4, 2);

    } else if (dir === 'up') {
      // Cabelo de costas
      ctx.fillStyle = colors.H;
      ctx.fillRect(5, PADDING_TOP + 2, 14, 12);
      ctx.fillStyle = colors.h;
      ctx.fillRect(7, PADDING_TOP + 2, 10, 4);
      ctx.fillStyle = colors.D;
      ctx.fillRect(6, PADDING_TOP + 11, 12, 3);

      // Camiseta branca
      ctx.fillStyle = colors.T;
      ctx.fillRect(5, PADDING_TOP + 16, 14, 8);
      ctx.fillStyle = colors.t;
      ctx.fillRect(5, PADDING_TOP + 22, 14, 2);

      // Calça
      ctx.fillStyle = colors.P;
      ctx.fillRect(7, PADDING_TOP + 24 + legOffsetL, 4, 5);
      ctx.fillRect(13, PADDING_TOP + 24 + legOffsetR, 4, 5);

      // Tênis
      ctx.fillStyle = colors.K;
      ctx.fillRect(7, PADDING_TOP + 28 + legOffsetL, 4, 2);
      ctx.fillRect(13, PADDING_TOP + 28 + legOffsetR, 4, 2);

    } else {
      const isLeft = dir === 'left';
      ctx.save();
      if (isLeft) {
        ctx.translate(24, 0);
        ctx.scale(-1, 1);
      }

      // Cabelo
      ctx.fillStyle = colors.H;
      ctx.fillRect(6, PADDING_TOP + 2, 11, 6);
      ctx.fillStyle = colors.h;
      ctx.fillRect(8, PADDING_TOP + 2, 8, 3);

      // Rosto
      ctx.fillStyle = colors.S;
      ctx.fillRect(9, PADDING_TOP + 6, 8, 9);

      // Óculos e olho
      ctx.fillStyle = colors.G;
      ctx.fillRect(13, PADDING_TOP + 7, 4, 3);
      ctx.fillRect(10, PADDING_TOP + 8, 3, 1); // haste
      ctx.fillStyle = colors.E;
      ctx.fillRect(14, PADDING_TOP + 8, 2, 2);

      // Barba
      ctx.fillStyle = colors.B;
      ctx.fillRect(12, PADDING_TOP + 12, 5, 4);
      ctx.fillRect(10, PADDING_TOP + 13, 3, 3);

      // Camiseta branca
      ctx.fillStyle = colors.T;
      ctx.fillRect(7, PADDING_TOP + 16, 9, 8);
      ctx.fillStyle = colors.S;
      ctx.fillRect(10, PADDING_TOP + 20, 3, 3);

      // Calça
      ctx.fillStyle = colors.P;
      ctx.fillRect(7, PADDING_TOP + 24 + legOffsetL, 4, 5);
      ctx.fillRect(12, PADDING_TOP + 24 + legOffsetR, 4, 5);

      // Tênis
      ctx.fillStyle = colors.K;
      ctx.fillRect(8, PADDING_TOP + 28 + legOffsetL, 4, 2);
      ctx.fillRect(13, PADDING_TOP + 28 + legOffsetR, 4, 2);

      ctx.restore();
    }

    this.cache.set(key, canvas);
    return canvas;
  }

  // ==========================================
  // SPRITE DA ZARA (Buldogue Francês Branco, Orelhas em Pé)
  // ==========================================
  getZaraSprite(frame = 0) {
    const key = `zara_${frame}`;
    if (this.cache.has(key)) return this.cache.get(key);

    const { canvas, ctx } = this.createCanvas(20, 20);
    const breathe = frame % 2 === 0 ? 0 : 1;

    // Branco do corpinho
    const W = '#FFFFFF';
    const G = '#E2E4E8'; // sombra
    const P = '#FFB6C1'; // interior da orelhinha
    const B = '#1A1A1A'; // focinho e olhinhos

    // Patinhas
    ctx.fillStyle = G;
    ctx.fillRect(4, 15, 3, 4);
    ctx.fillRect(12, 15, 3, 4);

    // Corpo gordinho compacto
    ctx.fillStyle = W;
    ctx.fillRect(3, 8 + breathe, 14, 8);
    ctx.fillStyle = G;
    ctx.fillRect(3, 14 + breathe, 14, 2);

    // Rabinho curto que mexe
    ctx.fillStyle = W;
    ctx.fillRect(1, 10 + breathe + (frame % 2), 2, 2);

    // Cabeça quadrada fofa de buldogue
    ctx.fillStyle = W;
    ctx.fillRect(5, 4 + breathe, 11, 7);

    // Focinho preto amassadinho
    ctx.fillStyle = B;
    ctx.fillRect(9, 8 + breathe, 3, 2);

    // Olhinhos pretos brilhantes
    ctx.fillStyle = B;
    ctx.fillRect(7, 6 + breathe, 2, 2);
    ctx.fillRect(13, 6 + breathe, 2, 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(7, 6 + breathe, 1, 1);
    ctx.fillRect(13, 6 + breathe, 1, 1);

    // AS FAMOSAS ORELHAS GRANDES EM PÉ (Bat Ears)
    ctx.fillStyle = W;
    ctx.fillRect(4, 0 + breathe, 3, 5);
    ctx.fillRect(14, 0 + breathe, 3, 5);
    // Interior rosa
    ctx.fillStyle = P;
    ctx.fillRect(5, 1 + breathe, 2, 4);
    ctx.fillRect(14, 1 + breathe, 2, 4);

    // Coleirinha rosa fofa
    ctx.fillStyle = '#FF4D7E';
    ctx.fillRect(6, 11 + breathe, 9, 2);

    this.cache.set(key, canvas);
    return canvas;
  }

  // ==========================================
  // SPRITE DA JULLY (Yorkshire Marrom Claro e Branco)
  // ==========================================
  getJullySprite(frame = 0) {
    const key = `jully_${frame}`;
    if (this.cache.has(key)) return this.cache.get(key);

    const { canvas, ctx } = this.createCanvas(20, 20);
    const trot = frame % 2 === 0 ? 0 : 1;

    const TAN = '#C89355'; // caramelo / marrom claro
    const TANDARK = '#9E6D35';
    const W = '#FFFFFF'; // pelinhos brancos
    const B = '#1A1A1A'; // focinho e olhos

    // Patinhas peludas
    ctx.fillStyle = TAN;
    ctx.fillRect(4, 14 + trot, 3, 4);
    ctx.fillRect(12, 14 - trot, 3, 4);

    // Corpinho peludo marrom claro e peito branco
    ctx.fillStyle = TAN;
    ctx.fillRect(3, 8, 13, 7);
    ctx.fillStyle = W;
    ctx.fillRect(6, 9, 6, 6); // peito branco
    ctx.fillStyle = TANDARK;
    ctx.fillRect(3, 13, 13, 2);

    // Rabinho peludo levantado
    ctx.fillStyle = TAN;
    ctx.fillRect(1, 7 + trot, 3, 3);
    ctx.fillStyle = W;
    ctx.fillRect(2, 6 + trot, 2, 2);

    // Cabeça peluda fofinha
    ctx.fillStyle = TAN;
    ctx.fillRect(6, 4, 9, 7);

    // Orelhas de Yorkie caídas/fofas
    ctx.fillStyle = TANDARK;
    ctx.fillRect(4, 3, 3, 4);
    ctx.fillRect(14, 3, 3, 4);

    // Lacinho rosa no topo da cabeça da Jully
    ctx.fillStyle = '#FF4D7E';
    ctx.fillRect(9, 2, 3, 2);
    ctx.fillStyle = '#FFAEC9';
    ctx.fillRect(8, 2, 1, 1);
    ctx.fillRect(12, 2, 1, 1);

    // Focinho e bigodinhos brancos
    ctx.fillStyle = W;
    ctx.fillRect(8, 8, 5, 3);
    ctx.fillStyle = B;
    ctx.fillRect(10, 8, 2, 2);

    // Olhinhos pretos doces
    ctx.fillStyle = B;
    ctx.fillRect(8, 6, 2, 2);
    ctx.fillRect(12, 6, 2, 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(8, 6, 1, 1);
    ctx.fillRect(12, 6, 1, 1);

    this.cache.set(key, canvas);
    return canvas;
  }

  // ==========================================
  // ITENS COLECIONÁVEIS (Sushi, Brigadeiro, Baú, Cristais)
  // ==========================================
  getSushiSprite() {
    if (this.cache.has('sushi')) return this.cache.get('sushi');
    const { canvas, ctx } = this.createCanvas(16, 16);

    // Pratinho
    ctx.fillStyle = '#E8E8E8';
    ctx.fillRect(1, 11, 14, 4);
    ctx.fillStyle = '#CCCCCC';
    ctx.fillRect(3, 14, 10, 1);

    // Nori preto por fora
    ctx.fillStyle = '#1A2A20';
    ctx.fillRect(3, 4, 10, 8);

    // Arroz branco
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(4, 5, 8, 6);

    // Salmão rosa e pepino verde no centro
    ctx.fillStyle = '#FF6B6B';
    ctx.fillRect(6, 6, 4, 4);
    ctx.fillStyle = '#FF8E8E';
    ctx.fillRect(7, 7, 2, 2);
    ctx.fillStyle = '#48BB78';
    ctx.fillRect(5, 7, 1, 2);

    this.cache.set('sushi', canvas);
    return canvas;
  }

  getBrigadeiroSprite() {
    if (this.cache.has('brigadeiro')) return this.cache.get('brigadeiro');
    const { canvas, ctx } = this.createCanvas(16, 16);

    // Forminha marrom plissada
    ctx.fillStyle = '#5A3D28';
    ctx.fillRect(4, 10, 8, 5);
    ctx.fillStyle = '#8B5A2B';
    ctx.fillRect(3, 9, 10, 2);

    // Bola de brigadeiro de chocolate
    ctx.fillStyle = '#2B1408';
    ctx.fillRect(4, 4, 8, 7);
    ctx.fillRect(3, 5, 10, 5);

    // Granulados de chocolate realçados
    ctx.fillStyle = '#4A2A18';
    ctx.fillRect(5, 5, 2, 1);
    ctx.fillRect(8, 6, 2, 1);
    ctx.fillRect(5, 8, 2, 1);
    ctx.fillRect(9, 8, 2, 1);
    ctx.fillStyle = '#6E4128';
    ctx.fillRect(6, 4, 1, 1);
    ctx.fillRect(8, 5, 1, 1);

    this.cache.set('brigadeiro', canvas);
    return canvas;
  }

  getMemoryCrystalSprite(year = 1) {
    const key = `crystal_${year}`;
    if (this.cache.has(key)) return this.cache.get(key);

    const { canvas, ctx } = this.createCanvas(16, 20);

    // Coração Dourado / Cristal da Memória
    const gold = '#FFD700';
    const lightGold = '#FFF380';
    const darkGold = '#C59B27';
    const pink = '#FF4D7E';

    // Formato de Coração de Cristal
    ctx.fillStyle = gold;
    ctx.fillRect(3, 4, 4, 4);
    ctx.fillRect(9, 4, 4, 4);
    ctx.fillRect(2, 6, 12, 5);
    ctx.fillRect(4, 11, 8, 4);
    ctx.fillRect(6, 15, 4, 2);
    ctx.fillRect(7, 17, 2, 1);

    // Brilho facetado
    ctx.fillStyle = lightGold;
    ctx.fillRect(4, 5, 2, 2);
    ctx.fillRect(10, 5, 2, 2);
    ctx.fillRect(4, 8, 3, 3);

    // Coração rosa interno
    ctx.fillStyle = pink;
    ctx.fillRect(7, 8, 2, 2);

    this.cache.set(key, canvas);
    return canvas;
  }

  getChestSprite(isOpen = false) {
    const key = `chest_${isOpen}`;
    if (this.cache.has(key)) return this.cache.get(key);

    const { canvas, ctx } = this.createCanvas(24, 22);

    const wood = '#8B5A2B';
    const darkWood = '#5C3818';
    const gold = '#FFD700';
    const lightGold = '#FFE866';

    if (!isOpen) {
      // Baú Fechado
      ctx.fillStyle = wood;
      ctx.fillRect(3, 6, 18, 14);
      ctx.fillStyle = darkWood;
      ctx.fillRect(3, 18, 18, 2);
      ctx.fillRect(3, 6, 18, 2);

      // Faixas de Ouro
      ctx.fillStyle = gold;
      ctx.fillRect(2, 8, 20, 2);
      ctx.fillRect(5, 6, 2, 14);
      ctx.fillRect(17, 6, 2, 14);

      // Fechadura em formato de coração
      ctx.fillStyle = '#FF4D7E';
      ctx.fillRect(10, 10, 4, 4);
      ctx.fillStyle = gold;
      ctx.fillRect(11, 11, 2, 2);
    } else {
      // Baú Aberto com luz emanando
      ctx.fillStyle = darkWood;
      ctx.fillRect(3, 10, 18, 10);

      // Tampa aberta para cima
      ctx.fillStyle = wood;
      ctx.fillRect(2, 2, 20, 7);
      ctx.fillStyle = gold;
      ctx.fillRect(1, 2, 22, 2);
      ctx.fillRect(5, 2, 2, 7);
      ctx.fillRect(17, 2, 2, 7);

      // Tesouro e Luz Dourada jorrando
      ctx.fillStyle = lightGold;
      ctx.fillRect(4, 8, 16, 4);
      ctx.fillStyle = '#FF4D7E';
      ctx.fillRect(8, 7, 3, 3);
      ctx.fillRect(13, 8, 3, 3);
    }

    this.cache.set(key, canvas);
    return canvas;
  }

  // ==========================================
  // NOVOS SPRITES: MARCADOR DE FOTOS, ROSAS, CARTINHAS E CENÁRIOS
  // ==========================================

  // Marcador Flutuante de Foto Polaroid
  getPhotoMarkerSprite(unlocked = false) {
    const key = `photo_marker_${unlocked}`;
    if (this.cache.has(key)) return this.cache.get(key);

    const { canvas, ctx } = this.createCanvas(20, 20);

    // Moldura Polaroid branca
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(2, 2, 16, 16);
    ctx.fillStyle = '#E2E8F0';
    ctx.fillRect(2, 16, 16, 2);

    // Lente / visor da câmera
    ctx.fillStyle = unlocked ? '#FF4D7E' : '#3182CE';
    ctx.fillRect(4, 4, 12, 10);

    // Detalhe de lente
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(6, 6, 3, 3);

    // Ícone de coração no canto se já descoberta
    if (unlocked) {
      ctx.fillStyle = '#FFD700';
      ctx.fillRect(12, 13, 4, 3);
    }

    this.cache.set(key, canvas);
    return canvas;
  }

  // Rosa Vermelha Romântica Colecionável
  getRoseSprite() {
    if (this.cache.has('rose')) return this.cache.get('rose');
    const { canvas, ctx } = this.createCanvas(16, 16);

    // Caule e folhas
    ctx.fillStyle = '#2E7D32';
    ctx.fillRect(7, 8, 2, 7);
    ctx.fillRect(5, 11, 2, 2);
    ctx.fillRect(9, 10, 2, 2);

    // Pétalas da Rosa Vermelha
    ctx.fillStyle = '#D32F2F';
    ctx.fillRect(5, 3, 6, 6);
    ctx.fillRect(4, 4, 8, 4);

    // Brilho e centro
    ctx.fillStyle = '#FF5252';
    ctx.fillRect(6, 4, 4, 3);
    ctx.fillStyle = '#FF8A80';
    ctx.fillRect(7, 4, 2, 1);

    this.cache.set('rose', canvas);
    return canvas;
  }

  // Cartinha de Amor Secreta
  getLetterSprite() {
    if (this.cache.has('letter')) return this.cache.get('letter');
    const { canvas, ctx } = this.createCanvas(16, 16);

    // Envelope branco/creme
    ctx.fillStyle = '#FFF8E7';
    ctx.fillRect(2, 4, 12, 9);
    ctx.fillStyle = '#E6DCBF';
    ctx.fillRect(2, 12, 12, 1);

    // Dobras do envelope
    ctx.fillStyle = '#D8CCA8';
    ctx.fillRect(3, 5, 2, 2);
    ctx.fillRect(11, 5, 2, 2);

    // Selo de coração vermelho
    ctx.fillStyle = '#FF4D7E';
    ctx.fillRect(6, 7, 4, 3);
    ctx.fillRect(7, 6, 2, 1);

    this.cache.set('letter', canvas);
    return canvas;
  }

  // Estação de Macarrão Artesanal & Aperol (massa.jpg)
  getPastaStationSprite() {
    if (this.cache.has('pasta_station')) return this.cache.get('pasta_station');
    const { canvas, ctx } = this.createCanvas(32, 24);

    // Bancada de Madeira Rústica
    ctx.fillStyle = '#8B5A2B';
    ctx.fillRect(2, 6, 28, 16);
    ctx.fillStyle = '#5C3818';
    ctx.fillRect(2, 20, 28, 2);

    // Toalha xadrez vermelha e branca
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(4, 4, 24, 6);
    ctx.fillStyle = '#E53E3E';
    ctx.fillRect(6, 4, 4, 6);
    ctx.fillRect(14, 4, 4, 6);
    ctx.fillRect(22, 4, 4, 6);

    // Prato de massa caseira
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(6, 6, 10, 4);
    ctx.fillStyle = '#ECC94B'; // talharim
    ctx.fillRect(8, 5, 6, 4);
    ctx.fillStyle = '#E53E3E'; // molho de tomate
    ctx.fillRect(9, 6, 4, 2);

    // Taça de Aperol Spritz laranja
    ctx.fillStyle = '#FF7A00';
    ctx.fillRect(20, 3, 4, 6);
    ctx.fillStyle = '#CBD5E0';
    ctx.fillRect(21, 9, 2, 4);

    this.cache.set('pasta_station', canvas);
    return canvas;
  }

  // Sombreros Mexicanos Festivos (mexicano.jpg)
  getSombreroSprite() {
    if (this.cache.has('sombrero')) return this.cache.get('sombrero');
    const { canvas, ctx } = this.createCanvas(28, 22);

    // Mesa / balcão festivo
    ctx.fillStyle = '#A0522D';
    ctx.fillRect(2, 10, 24, 10);

    // Aba larga do chapéu amarelo
    ctx.fillStyle = '#F6E05E';
    ctx.fillRect(4, 8, 20, 4);

    // Topo do chapéu
    ctx.fillStyle = '#ECC94B';
    ctx.fillRect(9, 3, 10, 6);

    // Faixa colorida mexicana (verde e vermelha)
    ctx.fillStyle = '#E53E3E';
    ctx.fillRect(9, 7, 10, 1);
    ctx.fillStyle = '#38A169';
    ctx.fillRect(9, 8, 10, 1);

    // Nachos / Tacos na mesa
    ctx.fillStyle = '#F6AD55';
    ctx.fillRect(18, 12, 6, 4);

    this.cache.set('sombrero', canvas);
    return canvas;
  }

  // Abóbora Iluminada de Halloween (halloween1.jpg)
  getPumpkinSprite() {
    if (this.cache.has('pumpkin')) return this.cache.get('pumpkin');
    const { canvas, ctx } = this.createCanvas(22, 22);

    // Corpo de abóbora laranja
    ctx.fillStyle = '#DD6B20';
    ctx.fillRect(4, 6, 14, 13);
    ctx.fillStyle = '#ED8936';
    ctx.fillRect(6, 4, 10, 15);

    // Caule verde
    ctx.fillStyle = '#2F855A';
    ctx.fillRect(10, 2, 2, 3);

    // Olhos e sorriso triangulares iluminados de amarelo
    ctx.fillStyle = '#FFEB3B';
    ctx.fillRect(7, 8, 2, 2);
    ctx.fillRect(13, 8, 2, 2);
    ctx.fillRect(8, 13, 6, 2);
    ctx.fillRect(9, 12, 1, 1);
    ctx.fillRect(12, 12, 1, 1);

    this.cache.set('pumpkin', canvas);
    return canvas;
  }

  // Caldeirão Mágico / Lápide Fofa de Halloween (halloween2.jpg)
  getHalloweenCauldronSprite() {
    if (this.cache.has('cauldron')) return this.cache.get('cauldron');
    const { canvas, ctx } = this.createCanvas(24, 24);

    // Caldeirão de ferro escuro
    ctx.fillStyle = '#2D3748';
    ctx.fillRect(5, 8, 14, 12);
    ctx.fillRect(3, 10, 18, 8);

    // Borda superior
    ctx.fillStyle = '#4A5568';
    ctx.fillRect(4, 7, 16, 2);

    // Poção mágica borbulhante roxa/verde
    ctx.fillStyle = '#9F7AEA';
    ctx.fillRect(6, 6, 12, 3);
    ctx.fillStyle = '#48BB78';
    ctx.fillRect(8, 5, 3, 2);
    ctx.fillRect(13, 4, 2, 2);

    // Foguinho embaixo
    ctx.fillStyle = '#F56565';
    ctx.fillRect(8, 20, 8, 3);
    ctx.fillStyle = '#ED8936';
    ctx.fillRect(10, 19, 4, 3);

    this.cache.set('cauldron', canvas);
    return canvas;
  }

  // Tapete Vermelho e Entrada de Gala (gala.jpg)
  getGalaArchSprite() {
    if (this.cache.has('gala_arch')) return this.cache.get('gala_arch');
    const { canvas, ctx } = this.createCanvas(32, 28);

    // Pilares dourados com cordão de veludo
    ctx.fillStyle = '#D69E2E';
    ctx.fillRect(4, 6, 4, 18);
    ctx.fillRect(24, 6, 4, 18);

    // Globos dourados nos postes
    ctx.fillStyle = '#ECC94B';
    ctx.fillRect(3, 4, 6, 4);
    ctx.fillRect(23, 4, 6, 4);

    // Cordão de veludo rosa/vermelho
    ctx.fillStyle = '#E53E3E';
    ctx.fillRect(8, 10, 16, 2);

    // Tapete vermelho no chão
    ctx.fillStyle = '#9B2C2C';
    ctx.fillRect(8, 16, 16, 10);
    ctx.fillStyle = '#C53030';
    ctx.fillRect(10, 16, 12, 10);

    this.cache.set('gala_arch', canvas);
    return canvas;
  }

  // Espelho / Penteadeira com Moldura de Coração (selfie.jpg)
  getVanityMirrorSprite() {
    if (this.cache.has('vanity_mirror')) return this.cache.get('vanity_mirror');
    const { canvas, ctx } = this.createCanvas(24, 26);

    // Mesa de madeira branca/creme
    ctx.fillStyle = '#EDF2F7';
    ctx.fillRect(4, 14, 16, 10);
    ctx.fillStyle = '#CBD5E0';
    ctx.fillRect(4, 22, 16, 2);

    // Moldura de espelho em coração rosa
    ctx.fillStyle = '#FF7096';
    ctx.fillRect(6, 3, 12, 11);
    ctx.fillRect(5, 5, 14, 7);

    // Vidro espelhado com brilho
    ctx.fillStyle = '#BEE3F8';
    ctx.fillRect(7, 5, 10, 8);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(8, 6, 3, 6);

    // Luzinhas no espelho
    ctx.fillStyle = '#FFF8E7';
    ctx.fillRect(5, 3, 2, 2);
    ctx.fillRect(17, 3, 2, 2);

    this.cache.set('vanity_mirror', canvas);
    return canvas;
  }

  // Banco dos Namorados Romântico com Flores (abraco.jpg)
  getCoupleBenchSprite() {
    if (this.cache.has('couple_bench')) return this.cache.get('couple_bench');
    const { canvas, ctx } = this.createCanvas(28, 22);

    // Encosto do banco de madeira
    ctx.fillStyle = '#8B5A2B';
    ctx.fillRect(4, 4, 20, 6);
    ctx.fillStyle = '#5C3818';
    ctx.fillRect(4, 4, 20, 2);

    // Assento
    ctx.fillStyle = '#A0522D';
    ctx.fillRect(3, 10, 22, 4);

    // Almofadas em formato de coração
    ctx.fillStyle = '#FF4D7E';
    ctx.fillRect(8, 8, 4, 4);
    ctx.fillRect(16, 8, 4, 4);

    // Pés do banco
    ctx.fillStyle = '#3E2723';
    ctx.fillRect(5, 14, 3, 6);
    ctx.fillRect(20, 14, 3, 6);

    this.cache.set('couple_bench', canvas);
    return canvas;
  }

  // Píer de Pôr do Sol no Lago (pordosol.jpg)
  getPierSunsetSprite() {
    if (this.cache.has('pier_sunset')) return this.cache.get('pier_sunset');
    const { canvas, ctx } = this.createCanvas(30, 24);

    // Píer de madeira avançando na água
    ctx.fillStyle = '#8B5A2B';
    ctx.fillRect(2, 6, 26, 14);
    ctx.fillStyle = '#6E4522';
    for (let x = 4; x < 26; x += 5) {
      ctx.fillRect(x, 6, 1, 14);
    }

    // Poste com lamparina quente
    ctx.fillStyle = '#2D3748';
    ctx.fillRect(4, 1, 2, 9);
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(3, 2, 4, 4);

    // Dois pares de óculos de sol estilosos na ponta do deck
    ctx.fillStyle = '#1A202C';
    ctx.fillRect(16, 12, 5, 2);
    ctx.fillRect(22, 12, 5, 2);

    this.cache.set('pier_sunset', canvas);
    return canvas;
  }
}

export const sprites = new SpriteGenerator();
