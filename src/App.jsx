import React, { useState, useEffect, useRef } from 'react';
import { Chess } from 'chess.js';

// ===== Pieces (Cburnett SVG, embedded as data-URIs) =====
const PIECE_SVG = {"wK":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 45 45\"><g fill=\"none\" fill-rule=\"evenodd\" stroke=\"#000\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.5\"><path stroke-linejoin=\"miter\" d=\"M22.5 11.63V6M20 8h5\"/><path fill=\"#fff\" stroke-linecap=\"butt\" stroke-linejoin=\"miter\" d=\"M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5\"/><path fill=\"#fff\" d=\"M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 5 10 5 10z\"/><path d=\"M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0\"/></g></svg>","wQ":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 45 45\"><g fill=\"#fff\" fill-rule=\"evenodd\" stroke=\"#000\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.5\"><path d=\"M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0m16.5-4.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0M41 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0M16 8.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0M33 9a2 2 0 1 1-4 0 2 2 0 1 1 4 0\"/><path stroke-linecap=\"butt\" d=\"M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-14V25L7 14z\"/><path stroke-linecap=\"butt\" d=\"M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z\"/><path fill=\"none\" d=\"M11.5 30c3.5-1 18.5-1 22 0M12 33.5c6-1 15-1 21 0\"/></g></svg>","wR":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 45 45\"><g fill=\"#fff\" fill-rule=\"evenodd\" stroke=\"#000\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.5\"><path stroke-linecap=\"butt\" d=\"M9 39h27v-3H9zm3-3v-4h21v4zm-1-22V9h4v2h5V9h5v2h5V9h4v5\"/><path d=\"m34 14-3 3H14l-3-3\"/><path stroke-linecap=\"butt\" stroke-linejoin=\"miter\" d=\"M31 17v12.5H14V17\"/><path d=\"m31 29.5 1.5 2.5h-20l1.5-2.5\"/><path fill=\"none\" stroke-linejoin=\"miter\" d=\"M11 14h23\"/></g></svg>","wB":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 45 45\"><g fill=\"none\" fill-rule=\"evenodd\" stroke=\"#000\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.5\"><g fill=\"#fff\" stroke-linecap=\"butt\"><path d=\"M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.35.49-2.32.47-3-.5 1.35-1.94 3-2 3-2z\"/><path d=\"M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z\"/><path d=\"M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z\"/></g><path stroke-linejoin=\"miter\" d=\"M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5\"/></g></svg>","wN":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 45 45\"><g fill=\"none\" fill-rule=\"evenodd\" stroke=\"#000\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.5\"><path fill=\"#fff\" d=\"M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21\"/><path fill=\"#fff\" d=\"M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3\"/><path fill=\"#000\" d=\"M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0m5.433-9.75a.5 1.5 30 1 1-.866-.5.5 1.5 30 1 1 .866.5\"/></g></svg>","wP":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 45 45\"><path fill=\"#fff\" stroke=\"#000\" stroke-linecap=\"round\" stroke-width=\"1.5\" d=\"M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z\"/></svg>","bK":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 45 45\"><g fill=\"none\" fill-rule=\"evenodd\" stroke=\"#000\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.5\"><path stroke-linejoin=\"miter\" d=\"M22.5 11.6V6\"/><path fill=\"#000\" stroke-linecap=\"butt\" stroke-linejoin=\"miter\" d=\"M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5\"/><path fill=\"#000\" d=\"M11.5 37a22.3 22.3 0 0 0 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 5 10 5 10z\"/><path stroke-linejoin=\"miter\" d=\"M20 8h5\"/><path stroke=\"#ececec\" d=\"M32 29.5s8.5-4 6-9.7C34.1 14 25 18 22.5 24.6v2.1-2.1C20 18 9.9 14 7 19.9c-2.5 5.6 4.8 9 4.8 9\"/><path stroke=\"#ececec\" d=\"M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0\"/></g></svg>","bQ":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 45 45\"><g fill-rule=\"evenodd\" stroke=\"#000\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.5\"><g stroke=\"none\"><circle cx=\"6\" cy=\"12\" r=\"2.75\"/><circle cx=\"14\" cy=\"9\" r=\"2.75\"/><circle cx=\"22.5\" cy=\"8\" r=\"2.75\"/><circle cx=\"31\" cy=\"9\" r=\"2.75\"/><circle cx=\"39\" cy=\"12\" r=\"2.75\"/></g><path stroke-linecap=\"butt\" d=\"M9 26c8.5-1.5 21-1.5 27 0l2.5-12.5L31 25l-.3-14.1-5.2 13.6-3-14.5-3 14.5-5.2-13.6L14 25 6.5 13.5z\"/><path stroke-linecap=\"butt\" d=\"M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z\"/><path fill=\"none\" stroke-linecap=\"butt\" d=\"M11 38.5a35 35 1 0 0 23 0\"/><path fill=\"none\" stroke=\"#ececec\" d=\"M11 29a35 35 1 0 1 23 0m-21.5 2.5h20m-21 3a35 35 1 0 0 22 0m-23 3a35 35 1 0 0 24 0\"/></g></svg>","bR":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 45 45\"><g fill-rule=\"evenodd\" stroke=\"#000\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.5\"><path stroke-linecap=\"butt\" d=\"M9 39h27v-3H9zm3.5-7 1.5-2.5h17l1.5 2.5zm-.5 4v-4h21v4z\"/><path stroke-linecap=\"butt\" stroke-linejoin=\"miter\" d=\"M14 29.5v-13h17v13z\"/><path stroke-linecap=\"butt\" d=\"M14 16.5 11 14h23l-3 2.5zM11 14V9h4v2h5V9h5v2h5V9h4v5z\"/><path fill=\"none\" stroke=\"#ececec\" stroke-linejoin=\"miter\" stroke-width=\"1\" d=\"M12 35.5h21m-20-4h19m-18-2h17m-17-13h17M11 14h23\"/></g></svg>","bB":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 45 45\"><g fill=\"none\" fill-rule=\"evenodd\" stroke=\"#000\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.5\"><g fill=\"#000\" stroke-linecap=\"butt\"><path d=\"M9 36c3.4-1 10.1.4 13.5-2 3.4 2.4 10.1 1 13.5 2 0 0 1.6.5 3 2-.7 1-1.6 1-3 .5-3.4-1-10.1.5-13.5-1-3.4 1.5-10.1 0-13.5 1-1.4.5-2.3.5-3-.5 1.4-2 3-2 3-2z\"/><path d=\"M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z\"/><path d=\"M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z\"/></g><path stroke=\"#ececec\" stroke-linejoin=\"miter\" d=\"M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5\"/></g></svg>","bN":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 45 45\"><g fill=\"none\" fill-rule=\"evenodd\" stroke=\"#000\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.5\"><path fill=\"#000\" d=\"M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21\"/><path fill=\"#000\" d=\"M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.04-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-1-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-2 2.5-3c1 0 1 3 1 3\"/><path fill=\"#ececec\" stroke=\"#ececec\" d=\"M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0m5.43-9.75a.5 1.5 30 1 1-.86-.5.5 1.5 30 1 1 .86.5\"/><path fill=\"#ececec\" stroke=\"none\" d=\"m24.55 10.4-.45 1.45.5.15c3.15 1 5.65 2.49 7.9 6.75S35.75 29.06 35.25 39l-.05.5h2.25l.05-.5c.5-10.06-.88-16.85-3.25-21.34s-5.79-6.64-9.19-7.16z\"/></g></svg>","bP":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 45 45\"><path stroke=\"#000\" stroke-linecap=\"round\" stroke-width=\"1.5\" d=\"M22.5 9a4 4 0 0 0-3.22 6.38 6.48 6.48 0 0 0-.87 10.65c-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47a6.46 6.46 0 0 0-.87-10.65A4.01 4.01 0 0 0 22.5 9z\"/></svg>"};

// ===== Helpers =====
const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const FR = { N: 'C', B: 'F', R: 'T', Q: 'D', K: 'R' };
function sanToFr(san) { if (!san) return san; return san.replace(/[NBRQK]/g, m => FR[m] || m); }
function pieceImg(code) { return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(PIECE_SVG[code] || ''); }
function norm(s) { return (s || '').replace(/[+#!?]/g, ''); }
function safeGame(fen) { try { return new Chess(fen); } catch (e) { return new Chess(); } }
function safeMove(g, arg) { try { return g.move(arg); } catch (e) { return null; } }
function fromOf(fen, san) { const g = safeGame(fen); const m = safeMove(g, san); return m ? m.from : null; }
function moveHint(san) {
  if (san.startsWith('O-O-O')) return 'le grand roque';
  if (san.startsWith('O-O')) return 'le petit roque';
  const map = { N: 'le cavalier', B: 'le fou', R: 'la tour', Q: 'la dame', K: 'le roi' };
  return map[san[0]] || 'le pion';
}
function inCheckOf(g) { try { return g.inCheck ? g.inCheck() : (g.in_check ? g.in_check() : false); } catch (e) { return false; } }
function checkSq(fen) {
  const g = safeGame(fen);
  if (!inCheckOf(g)) return null;
  const t = g.turn();
  for (const f of 'abcdefgh') for (let r = 1; r <= 8; r++) {
    const sq = f + r; const p = g.get(sq);
    if (p && p.type === 'k' && p.color === t) return sq;
  }
  return null;
}

// ===== Persistence =====
const LS_KEY = 'gambit_v1';
function freshState() { return { mastered: [], solved: [], tried: [], attempts: 0, clean: 0, streak: 0, best: 0, lastDate: null }; }
function loadState() { try { const r = localStorage.getItem(LS_KEY); if (r) return { ...freshState(), ...JSON.parse(r) }; } catch (e) {} return freshState(); }
function saveState(s) { try { localStorage.setItem(LS_KEY, JSON.stringify(s)); } catch (e) {} }
function ymd(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
function todayStr() { return ymd(new Date()); }
function bumpStreak(s) {
  const t = todayStr();
  if (s.lastDate === t) return s;
  const y = new Date(); y.setDate(y.getDate() - 1);
  const streak = s.lastDate === ymd(y) ? (s.streak || 0) + 1 : 1;
  return { ...s, streak, best: Math.max(s.best || 0, streak), lastDate: t };
}

function injectFonts() {
  try {
    if (document.getElementById('gambit-fonts')) return;
    const pre = (h, c) => { const l = document.createElement('link'); l.rel = 'preconnect'; l.href = h; if (c) l.crossOrigin = ''; document.head.appendChild(l); };
    const add = (h) => { const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = h; document.head.appendChild(l); };
    pre('https://fonts.googleapis.com'); pre('https://fonts.gstatic.com', true); pre('https://api.fontshare.com');
    add('https://api.fontshare.com/v2/css?f[]=clash-display@600,700&f[]=satoshi@400,500,700&display=swap');
    add('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@1,9..144,400;1,9..144,500&family=JetBrains+Mono:wght@400;600&display=swap');
    const m = document.createElement('meta'); m.id = 'gambit-fonts'; document.head.appendChild(m);
  } catch (e) {}
}

// ===== Content =====
const HIGHLIGHT = {
  title: "Avant chaque coup : qu'est-ce qui est en prise ?",
  text: `À 300 elo, l'immense majorité des points se gagnent ou se perdent sur des pièces laissées en prise. Avant de jouer, balaie l'échiquier : 1) est-ce que MON coup laisse une pièce gratuite ? 2) est-ce que l'adversaire vient de laisser quelque chose à prendre ? Ce seul réflexe vaut des centaines de points.`,
};
const PRINCIPLES = [
  { title: 'Contrôle le centre', text: `Occupe ou contrôle e4-d4-e5-d5. Plus de centre = plus d'espace, plus de mobilité pour tes pièces.` },
  { title: 'Développe tes pièces', text: `Sors cavaliers et fous vers le centre dès l'ouverture. Vise une pièce nouvelle à chaque coup.` },
  { title: 'Cavaliers avant les fous', text: `En général, sors les cavaliers d'abord : leur meilleure case est souvent évidente, celle des fous attend de voir le jeu.` },
  { title: 'Roque tôt', text: `Mets ton roi à l'abri, presque toujours dans les dix premiers coups. Un roi au centre, c'est un roi en danger.` },
  { title: 'Ne sors pas ta dame trop tôt', text: `L'adversaire la chasse en développant ses pièces et gagne des tempos gratuits. Patiente.` },
  { title: 'Ne bouge pas deux fois la même pièce', text: `En ouverture chaque tempo compte. Développe du neuf plutôt que de promener la même pièce.` },
  { title: 'Connecte tes tours', text: `Une fois les pièces sorties et le roque fait, relie tes tours sur la dernière rangée : elles se protègent et contrôlent les colonnes.` },
];

const OPENINGS = [
  {
    id: 'italienne', name: 'Ouverture Italienne', color: 'Blancs',
    short: 'Le classique : centre, fou actif, roque rapide.',
    desc: `L'ouverture idéale pour débuter avec les Blancs. Tu prends le centre, tu développes vite ton fou vers le point faible f7, et tu roques. Que des principes.`,
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5', 'c3', 'Nf6', 'd3', 'd6', 'O-O', 'O-O', 'Re1', 'a6', 'a4', 'Ba7'],
    notes: [
      `Tu prends le centre et tu libères ton fou et ta dame. Le meilleur premier coup pour débuter.`,
      `Les Noirs répondent symétriquement et revendiquent leur part du centre.`,
      `Tu développes un cavalier ET tu attaques le pion e5. Sors les cavaliers tôt.`,
      `Les Noirs défendent e5 en développant à leur tour.`,
      `Le fou vise f7, le point faible des Noirs. C'est l'Italienne.`,
      `Les Noirs imitent et visent ton f2.`,
      `Tu prépares d4 pour bâtir un gros centre de pions.`,
      `Les Noirs développent et attaquent ton pion e4.`,
      `Tu soutiens e4 tranquillement. Solide et sans risque pour débuter.`,
      `Même idée côté noir : ils soutiennent e5.`,
      `Roque. Ton roi est en sécurité — fais-le presque toujours avant le coup 10.`,
      `Les Noirs sécurisent aussi leur roi.`,
      `La tour soutient le centre et la colonne e. Tu commences à connecter tes tours.`,
      `Les Noirs gardent une case de retraite pour leur fou.`,
      `Tu prends de l'espace à l'aile dame et gênes une poussée …b5.`,
      `Le fou se met à l'abri sur la grande diagonale. Position saine et jouable.`,
    ],
  },
  {
    id: 'londres', name: 'Système Londres', color: 'Blancs',
    short: 'Un système solide : toujours le même plan, peu de théorie.',
    desc: `Avec les Blancs, quasiment le même montage quoi que jouent les Noirs : Ff4, e3, Fd3, c3, Cbd2. Parfait quand on déteste mémoriser des lignes.`,
    moves: ['d4', 'd5', 'Bf4', 'Nf6', 'e3', 'e6', 'Nf3', 'Bd6', 'Bg3', 'O-O', 'Bd3', 'c5', 'c3', 'Nc6', 'Nbd2', 'b6'],
    notes: [
      `Tu occupes le centre. Base du Système Londres, un plan simple et répétable.`,
      `Les Noirs répondent au centre.`,
      `La clé de Londres : tu sors ce fou AVANT de jouer e3, pour ne pas l'enfermer derrière tes pions.`,
      `Les Noirs développent un cavalier.`,
      `Tu ouvres la diagonale de ton autre fou. Le fou f4 est déjà dehors, lui.`,
      `Les Noirs ouvrent pour leur fou.`,
      `Développement naturel du cavalier roi.`,
      `Les Noirs proposent d'échanger ton bon fou.`,
      `Tu évites l'échange et gardes ton fou actif.`,
      `Les Noirs roquent.`,
      `Ton fou vise l'aile roi adverse. Le montage Londres est presque complet.`,
      `Les Noirs frappent ton centre.`,
      `Tu soutiens d4. Beau triangle de pions c3-d4-e3.`,
      `Les Noirs développent.`,
      `Le dernier cavalier sort. Plan typique ensuite : Ce5, f4, attaque à l'aile roi.`,
      `Les Noirs préparent de fianchettoer leur fou. Montage terminé, à toi de jouer le plan.`,
    ],
  },
  {
    id: 'scandinave', name: 'Défense Scandinave', color: 'Noirs',
    short: 'Contre 1.e4 : frappe le centre dès le premier coup.',
    desc: `Simple et directe contre 1.e4. Tu obtiens un jeu clair. La seule nuance à connaître : où replacer la dame après l'avoir sortie.`,
    moves: ['e4', 'd5', 'exd5', 'Qxd5', 'Nc3', 'Qa5', 'd4', 'Nf6', 'Nf3', 'c6', 'Bc4', 'Bf5', 'Bd2', 'e6', 'Qe2', 'Bb4'],
    notes: [
      `Les Blancs ouvrent au centre.`,
      `Tu frappes tout de suite e4. C'est la Scandinave : simple et directe.`,
      `Les Blancs capturent.`,
      `Tu reprends. Oui, la dame sort tôt — l'exception qui se justifie ici.`,
      `Les Blancs attaquent ta dame en développant : ils gagnent un tempo.`,
      `Tu mets ta dame en sécurité sur une case active. Évite Dd8, trop passif.`,
      `Les Blancs prennent le centre.`,
      `Tu développes et contrôles des cases centrales.`,
      `Les Blancs développent.`,
      `Tu solidifies d5 et ouvres une retraite en c7 pour ta dame.`,
      `Les Blancs activent leur fou.`,
      `Tu sors ce fou AVANT de jouer e6, pour ne pas l'enfermer. Point important.`,
      `Les Blancs préparent de connecter et gênent ta dame.`,
      `Maintenant tu ouvres pour ton autre fou : le fou de cases blanches est déjà actif.`,
      `Les Blancs développent.`,
      `Tu développes avec une petite pression. Le roque suit. Position confortable.`,
    ],
  },
  {
    id: 'caro', name: 'Défense Caro-Kann', color: 'Noirs',
    short: 'Contre 1.e4 : solide, et ton fou respire.',
    desc: `Très solide contre 1.e4. Le gros atout : tu développes ton fou de cases blanches HORS de ta chaîne de pions avant de jouer e6.`,
    moves: ['e4', 'c6', 'd4', 'd5', 'Nc3', 'dxe4', 'Nxe4', 'Bf5', 'Ng3', 'Bg6', 'h4', 'h6', 'Nf3', 'Nd7', 'h5', 'Bh7'],
    notes: [
      `Les Blancs ouvrent.`,
      `Tu prépares …d5 en le soutenant. C'est la Caro-Kann : du solide.`,
      `Les Blancs construisent le centre.`,
      `Tu frappes le centre, soutenu par c6.`,
      `Les Blancs développent et pressent d5.`,
      `Tu captures pour clarifier la position.`,
      `Les Blancs reprennent.`,
      `Tu sors ton fou de dame dehors AVANT e6. C'est tout l'intérêt de la Caro.`,
      `Les Blancs attaquent ton fou.`,
      `Tu recules en gardant le fou actif sur la diagonale.`,
      `Les Blancs gagnent de l'espace et menacent h5.`,
      `Tu crées une case de retraite en h7 pour ton fou. Coup nécessaire.`,
      `Les Blancs développent.`,
      `Tu développes en gardant la case f6 libre pour l'autre cavalier.`,
      `Les Blancs repoussent le fou.`,
      `Le fou est à l'abri. Tu finiras par e6, Fd6 et le roque. Position saine.`,
    ],
  },
  {
    id: 'gdr', name: 'Gambit Dame Refusé', color: 'Noirs',
    short: 'Contre 1.d4 : du roc, rien ne casse.',
    desc: `Une structure ultra-solide contre 1.d4. Tu refuses le pion offert, tu soutiens d5 et tu développes proprement derrière tes pions.`,
    moves: ['d4', 'd5', 'c4', 'e6', 'Nc3', 'Nf6', 'Bg5', 'Be7', 'e3', 'O-O', 'Nf3', 'Nbd7', 'Rc1', 'c6'],
    notes: [
      `Les Blancs ouvrent à la dame.`,
      `Tu réponds au centre : solide.`,
      `Le Gambit Dame : les Blancs offrent un pion pour dévier ton centre.`,
      `Tu refuses (Gambit Dame Refusé) et tu soutiens d5. Très sûr.`,
      `Les Blancs développent et pressent d5.`,
      `Tu développes et défends d5.`,
      `Les Blancs clouent ton cavalier.`,
      `Tu brises le clouage et prépares le roque.`,
      `Les Blancs ouvrent pour leur fou.`,
      `Tu mets ton roi en sécurité.`,
      `Les Blancs développent.`,
      `Tu développes derrière tes pions : structure compacte.`,
      `Les Blancs placent une tour sur la colonne c.`,
      `Tu solidifies d5 (triangle c6-d5-e6). Position très solide, prête à jouer.`,
    ],
  },
  {
    id: 'espagnole', name: 'Espagnole (Ruy Lopez)', color: 'Blancs',
    short: 'Contre 1…e5 : la pression à la racine.',
    desc: `L'ouverture la plus jouée au sommet. Tu attaques le cavalier qui défend e5, puis tu bâtis lentement un grand centre avec c3 et d4.`,
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6', 'Ba4', 'Nf6', 'O-O', 'Be7', 'Re1', 'b5', 'Bb3', 'd6', 'c3', 'O-O'],
    notes: [
      `Tu prends le centre. L'ouverture reine au plus haut niveau.`,
      `Les Noirs répondent au centre.`,
      `Tu attaques e5 en développant.`,
      `Les Noirs défendent e5.`,
      `Le fou attaque le cavalier qui défend e5. C'est l'Espagnole.`,
      `Les Noirs interrogent ton fou (coup de Morphy).`,
      `Tu gardes le fou sur la diagonale en reculant.`,
      `Les Noirs développent et attaquent e4.`,
      `Tu roques sans défendre e4 : si …Cxe4, tu auras du jeu. Roque tôt.`,
      `Les Noirs développent et préparent le roque.`,
      `Tu soutiens e4 et occupes la colonne e.`,
      `Les Noirs repoussent définitivement le fou.`,
      `Le fou se replace sur la belle diagonale vers f7.`,
      `Les Noirs solidifient e5 et ouvrent leur fou de dame.`,
      `Tu prépares d4 pour bâtir le centre. Le plan typique de l'Espagnole.`,
      `Les Noirs roquent. Position riche, tout en manœuvres.`,
    ],
  },
  {
    id: 'ecossaise', name: 'Partie Écossaise', color: 'Blancs',
    short: 'Contre 1…e5 : on ouvre tout de suite.',
    desc: `Tu ouvres le centre dès le 4e coup pour un jeu clair et des pièces actives. Plus simple à jouer que l'Espagnole.`,
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'd4', 'exd4', 'Nxd4', 'Nf6', 'Nc3', 'Bb4', 'Nxc6', 'bxc6', 'Bd3', 'd5'],
    notes: [
      `Tu prends le centre.`,
      `Les Noirs répondent.`,
      `Tu attaques e5 en développant.`,
      `Les Noirs défendent.`,
      `Tu ouvres le centre immédiatement : c'est l'Écossaise.`,
      `Les Noirs capturent.`,
      `Tu reprends avec un cavalier bien centralisé.`,
      `Les Noirs développent et attaquent e4.`,
      `Tu défends e4 en développant.`,
      `Les Noirs clouent ton cavalier.`,
      `Tu casses la structure de pions noire.`,
      `Les Noirs reprennent ; leurs pions doublés sont une cible à long terme.`,
      `Tu développes ton fou vers l'aile roi et défends e4.`,
      `Les Noirs frappent au centre. Jeu ouvert et clair des deux côtés.`,
    ],
  },
  {
    id: 'gambitroi', name: 'Gambit du Roi', color: 'Blancs',
    short: 'Contre 1…e5 : romantique et tranchant.',
    desc: `Tu sacrifies un pion pour un centre massif et une attaque rapide sur f7. Risqué, mais redoutable si l'adversaire ne connaît pas.`,
    moves: ['e4', 'e5', 'f4', 'exf4', 'Nf3', 'g5', 'Bc4', 'Bg7', 'd4', 'd6'],
    notes: [
      `Tu prends le centre.`,
      `Les Noirs répondent.`,
      `Le Gambit du Roi : tu offres un pion pour un centre énorme et une attaque. Romantique et risqué.`,
      `Les Noirs acceptent le pion.`,
      `Tu développes et empêches un embêtant …Dh4+.`,
      `Les Noirs s'accrochent au pion f4 — agressif mais affaiblissant.`,
      `Ton fou vise f7. Tu développes vers l'attaque.`,
      `Les Noirs soutiennent g5 et fianchettent.`,
      `Tu bâtis le grand centre que le gambit t'offre.`,
      `Les Noirs ouvrent leur jeu. À toi de prouver l'attaque — sinon le pion en moins se paiera.`,
    ],
  },
  {
    id: 'sicilienne', name: 'Sicilienne (Najdorf)', color: 'Noirs',
    short: 'Contre 1.e4 : l\'arme combative par excellence.',
    desc: `La défense la plus jouée et la plus gagnante contre 1.e4. Tu acceptes un jeu déséquilibré pour jouer pour le gain. Variante Najdorf, la plus célèbre.`,
    moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'a6', 'Be2', 'e5', 'Nb3', 'Be7', 'O-O', 'O-O'],
    notes: [
      `Les Blancs ouvrent au centre.`,
      `Tu réponds en asymétrie : la Sicilienne, l'arme la plus combative contre 1.e4.`,
      `Les Blancs développent.`,
      `Tu prépares …Cf6 sans craindre e5, et tu ouvres ton fou de dame.`,
      `Les Blancs ouvrent le centre.`,
      `Tu captures : tu échanges un pion d'aile contre un pion central, bonne affaire.`,
      `Les Blancs reprennent avec le cavalier.`,
      `Tu développes et attaques e4.`,
      `Les Blancs défendent e4 en développant.`,
      `Le coup Najdorf : tu contrôles b5 et prépares …e5 ou …b5.`,
      `Les Blancs développent tranquillement.`,
      `Tu frappes au centre et chasses le cavalier d4. L'idée clé du Najdorf.`,
      `Le cavalier recule sur une bonne case.`,
      `Tu développes et prépares le roque.`,
      `Les Blancs roquent.`,
      `Tu sécurises ton roi. Position dynamique, jeu sur les deux ailes.`,
    ],
  },
  {
    id: 'francaise', name: 'Défense Française', color: 'Noirs',
    short: 'Contre 1.e4 : solide, sur la contre-attaque.',
    desc: `Tu cèdes un peu d'espace pour frapper le centre par …d5 et …c5. Très solide. Seul bémol : ton fou de cases blanches est souvent enfermé.`,
    moves: ['e4', 'e6', 'd4', 'd5', 'Nc3', 'Nf6', 'Bg5', 'Be7', 'e5', 'Nfd7', 'Bxe7', 'Qxe7', 'f4', 'O-O'],
    notes: [
      `Les Blancs ouvrent au centre.`,
      `Tu prépares …d5 pour défier e4. C'est la Française : solide, à contre-attaque.`,
      `Les Blancs prennent le grand centre.`,
      `Tu frappes e4, soutenu par e6.`,
      `Les Blancs défendent e4 en développant.`,
      `Tu mets la pression sur e4.`,
      `Les Blancs clouent ton cavalier.`,
      `Tu brises le clouage.`,
      `Les Blancs gagnent de l'espace et repoussent ton cavalier.`,
      `Le cavalier recule ; tu frapperas le centre par …c5 et …f6.`,
      `Les Blancs échangent.`,
      `Tu reprends de la dame.`,
      `Les Blancs soutiennent leur pointe e5.`,
      `Tu roques. Ton plan : …c5 contre la base d4 de la chaîne blanche.`,
    ],
  },
  {
    id: 'estindienne', name: 'Défense Est-Indienne', color: 'Noirs',
    short: 'Contre 1.d4 : laisser le centre… pour mieux le détruire.',
    desc: `Tu laisses les Blancs occuper le centre, puis tu le frappes par …e5 ou …c5 avec une attaque à l'aile roi. Hyper combative.`,
    moves: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'Bg7', 'e4', 'd6', 'Nf3', 'O-O', 'Be2', 'e5'],
    notes: [
      `Les Blancs ouvrent à la dame.`,
      `Tu développes et contrôles e4 et d5.`,
      `Les Blancs prennent de l'espace.`,
      `Tu prépares de fianchetter : l'Est-Indienne, hyper combative.`,
      `Les Blancs développent.`,
      `Ton fou contrôle la grande diagonale, vers le centre et l'aile dame adverse.`,
      `Les Blancs acceptent un gros centre — que tu vas attaquer plus tard.`,
      `Tu prépares …e5 pour frapper le centre.`,
      `Les Blancs développent.`,
      `Tu roques. Le plan noir : …e5 puis attaque à l'aile roi.`,
      `Les Blancs développent.`,
      `Tu frappes le centre. L'idée maîtresse : briser, puis attaquer.`,
    ],
  },
];

const PUZZLES = [
  { id: 'p1', fen: '6k1/5ppp/8/8/8/8/8/R5K1 w - - 0 1', side: 'w', solution: ['Ra8#'], theme: 'Mat du couloir', explain: `La tour mate sur la 8e rangée : le roi est piégé par ses propres pions. Pense toujours à l'aération de ton roi !` },
  { id: 'p2', fen: '6k1/5ppp/8/8/8/8/8/Q5K1 w - - 0 1', side: 'w', solution: ['Qa8#'], theme: 'Mat du couloir', explain: `Même idée avec la dame. Le mat du couloir est l'un des plus fréquents chez les débutants — dans les deux sens.` },
  { id: 'p3', fen: '7k/R7/8/8/8/8/8/1R5K w - - 0 1', side: 'w', solution: ['Rb8#'], theme: "Mat de l'escalier", explain: `Deux tours matent en escalier : l'une coupe la 7e rangée, l'autre donne l'échec final sur la 8e.` },
  { id: 'p4', fen: '6k1/3Q4/5K2/8/8/8/8/8 w - - 0 1', side: 'w', solution: ['Qg7#'], theme: 'Mat dame + roi', explain: `La dame mate soutenue par son roi : le roi adverse ne peut ni fuir ni capturer. Le mat à connaître par cœur.` },
  { id: 'p5', fen: '7k/8/6K1/8/8/8/8/R7 w - - 0 1', side: 'w', solution: ['Ra8#'], theme: 'Mat roi + tour', explain: `Le mat fondamental roi + tour : roi adverse acculé au bord, ton roi lui prend les cases de fuite, ta tour donne l'échec.` },
  { id: 'p6', fen: 'rnbqk1nr/pppp1ppp/8/3b4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1', side: 'w', solution: ['exd5'], theme: 'Pièce en prise', explain: `Le fou noir n'est pas défendu : tu le prends gratuitement. Le réflexe n°1 à 300 elo, c'est de repérer les pièces en prise.` },
  { id: 'p7', fen: 'r3k3/8/8/1N6/8/8/8/4K3 w - - 0 1', side: 'w', solution: ['Nc7+', 'Ke7', 'Nxa8'], theme: 'Fourchette du cavalier', explain: `Échec à la fourchette : le cavalier attaque le roi ET la tour en même temps. Le roi doit bouger, tu empoches la tour.` },
  { id: 'p8', fen: '6k1/pp3ppp/8/3N4/4q3/8/PP3PPP/5K2 w - - 0 1', side: 'w', solution: ['Nf6+', 'Kf8', 'Nxe4'], theme: 'Fourchette roi-dame', explain: `La fourchette royale : échec au roi tout en attaquant la dame. Le coup le plus rentable du cavalier.` },
  { id: 'p9', fen: 'r2qkb1r/ppp2ppp/2n1bn2/8/3P4/8/PPP1PPPP/RNBQKB1R w - - 0 1', side: 'w', solution: ['d5', 'Ne7', 'dxe6'], theme: 'Fourchette de pion', explain: `Un simple pion attaque deux pièces à la fois. Modeste, mais l'une des deux va tomber.` },
  { id: 'p10', fen: '4k3/8/8/8/7r/8/8/4K2R w K - 0 1', side: 'w', solution: ['Rxh4'], theme: 'Pièce en prise', explain: `La tour adverse est sans défense : tu l'empoches. Avant de chercher compliqué, regarde toujours les pièces non protégées.` },
];

// ===== Opening book (Explorer) =====
// Famous openings as move lines (main lines first within each branch).
const BOOK_LINES = [
  ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6', 'Ba4', 'Nf6', 'O-O', 'Be7'],
  ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5', 'c3', 'Nf6', 'd3'],
  ['e4', 'e5', 'Nf3', 'Nc6', 'd4', 'exd4', 'Nxd4', 'Nf6'],
  ['e4', 'e5', 'Nf3', 'Nc6', 'Nc3', 'Nf6'],
  ['e4', 'e5', 'Nf3', 'Nf6', 'Nxe5', 'd6', 'Nf3', 'Nxe4'],
  ['e4', 'e5', 'Bc4', 'Nf6', 'd3'],
  ['e4', 'e5', 'f4', 'exf4', 'Nf3', 'g5', 'Bc4'],
  ['e4', 'e5', 'Nc3', 'Nf6'],
  ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'a6'],
  ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'g6'],
  ['e4', 'c5', 'Nf3', 'Nc6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3'],
  ['e4', 'c5', 'c3', 'd5', 'exd5', 'Qxd5'],
  ['e4', 'c5', 'Nc3', 'Nc6', 'g3'],
  ['e4', 'e6', 'd4', 'd5', 'Nc3', 'Bb4'],
  ['e4', 'e6', 'd4', 'd5', 'Nd2', 'Nf6'],
  ['e4', 'e6', 'd4', 'd5', 'e5', 'c5'],
  ['e4', 'e6', 'd4', 'd5', 'exd5', 'exd5'],
  ['e4', 'c6', 'd4', 'd5', 'Nc3', 'dxe4', 'Nxe4', 'Bf5'],
  ['e4', 'c6', 'd4', 'd5', 'e5', 'Bf5'],
  ['e4', 'c6', 'd4', 'd5', 'exd5', 'cxd5', 'c4'],
  ['e4', 'd5', 'exd5', 'Qxd5', 'Nc3', 'Qa5'],
  ['e4', 'd6', 'd4', 'Nf6', 'Nc3', 'g6'],
  ['e4', 'g6', 'd4', 'Bg7', 'Nc3', 'd6'],
  ['e4', 'Nf6', 'e5', 'Nd5', 'd4', 'd6'],
  ['d4', 'd5', 'c4', 'e6', 'Nc3', 'Nf6', 'Bg5', 'Be7', 'e3', 'O-O'],
  ['d4', 'd5', 'c4', 'dxc4', 'Nf3', 'Nf6', 'e3'],
  ['d4', 'd5', 'c4', 'c6', 'Nf3', 'Nf6', 'Nc3'],
  ['d4', 'd5', 'c4', 'e6', 'Nc3', 'c6'],
  ['d4', 'd5', 'Bf4', 'Nf6', 'e3', 'e6', 'Nf3', 'Bd6', 'Bg3'],
  ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'Bg7', 'e4', 'd6', 'Nf3', 'O-O'],
  ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'd5'],
  ['d4', 'Nf6', 'c4', 'e6', 'Nc3', 'Bb4'],
  ['d4', 'Nf6', 'c4', 'e6', 'Nf3', 'b6'],
  ['d4', 'Nf6', 'c4', 'c5', 'd5'],
  ['d4', 'f5', 'g3', 'Nf6'],
  ['c4', 'e5', 'Nc3', 'Nf6'],
  ['c4', 'c5', 'Nf3', 'Nc6'],
  ['Nf3', 'd5', 'g3', 'Nf6', 'Bg2'],
];

const NAME_MAP = {
  'e4': 'Ouverture du pion roi', 'd4': 'Ouverture du pion dame', 'c4': 'Partie anglaise', 'Nf3': 'Ouverture Réti',
  'e4 e5': 'Partie ouverte',
  'e4 e5 Nf3 Nc6 Bb5': 'Espagnole (Ruy Lopez)',
  'e4 e5 Nf3 Nc6 Bb5 a6 Ba4': 'Espagnole, variante Morphy',
  'e4 e5 Nf3 Nc6 Bc4': 'Partie italienne',
  'e4 e5 Nf3 Nc6 Bc4 Bc5': 'Italienne, Giuoco Piano',
  'e4 e5 Nf3 Nc6 d4': 'Partie écossaise',
  'e4 e5 Nf3 Nc6 Nc3': 'Partie des quatre cavaliers',
  'e4 e5 Nf3 Nf6': 'Défense russe (Petroff)',
  'e4 e5 Bc4': 'Partie du fou',
  'e4 e5 f4': 'Gambit du Roi',
  'e4 e5 Nc3': 'Partie viennoise',
  'e4 c5': 'Défense sicilienne',
  'e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6': 'Sicilienne, Najdorf',
  'e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6': 'Sicilienne, Dragon',
  'e4 c5 Nf3 Nc6 d4': 'Sicilienne classique',
  'e4 c5 c3': 'Sicilienne, Alapin',
  'e4 c5 Nc3': 'Sicilienne fermée',
  'e4 e6': 'Défense française',
  'e4 e6 d4 d5 Nc3 Bb4': 'Française, Winawer',
  'e4 e6 d4 d5 Nd2': 'Française, Tarrasch',
  'e4 e6 d4 d5 e5': 'Française, variante d\'avance',
  'e4 e6 d4 d5 exd5': 'Française, variante d\'échange',
  'e4 c6': 'Défense Caro-Kann',
  'e4 c6 d4 d5 e5': 'Caro-Kann, variante d\'avance',
  'e4 c6 d4 d5 exd5 cxd5 c4': 'Caro-Kann, attaque Panov',
  'e4 d5': 'Défense scandinave',
  'e4 d6': 'Défense Pirc',
  'e4 g6': 'Défense moderne',
  'e4 Nf6': 'Défense Alekhine',
  'd4 d5': 'Partie du pion dame',
  'd4 d5 c4': 'Gambit dame',
  'd4 d5 c4 e6': 'Gambit dame refusé',
  'd4 d5 c4 dxc4': 'Gambit dame accepté',
  'd4 d5 c4 c6': 'Défense slave',
  'd4 d5 c4 e6 Nc3 c6': 'Défense semi-slave',
  'd4 d5 Bf4': 'Système Londres',
  'd4 Nf6 c4 g6 Nc3 Bg7': 'Défense est-indienne',
  'd4 Nf6 c4 g6 Nc3 d5': 'Défense Grünfeld',
  'd4 Nf6 c4 e6 Nc3 Bb4': 'Défense nimzo-indienne',
  'd4 Nf6 c4 e6 Nf3 b6': 'Défense ouest-indienne',
  'd4 Nf6 c4 c5': 'Défense Benoni',
  'd4 f5': 'Défense hollandaise',
  'c4 e5': 'Anglaise, variante inversée',
  'c4 c5': 'Anglaise symétrique',
};

function buildBook(lines) {
  const root = { children: {}, order: [] };
  for (const line of lines) {
    let n = root;
    for (const mv of line) {
      if (!n.children[mv]) { n.children[mv] = { children: {}, order: [] }; n.order.push(mv); }
      n = n.children[mv];
    }
  }
  return root;
}
const BOOK = buildBook(BOOK_LINES);
function bookNodeAt(path) { let n = BOOK; for (const mv of path) { if (!n.children[mv]) return null; n = n.children[mv]; } return n; }
function openingNameFor(path) { let name = null; for (let i = 1; i <= path.length; i++) { const k = path.slice(0, i).join(' '); if (NAME_MAP[k]) name = NAME_MAP[k]; } return name; }
function replayGame(history) { const g = new Chess(); for (const m of history) { if (!safeMove(g, m)) break; } return g; }
function isOver(g) { try { return g.isGameOver ? g.isGameOver() : (g.game_over ? g.game_over() : false); } catch (e) { return false; } }
function lastVerbose(g) { try { const h = g.history({ verbose: true }); return h.length ? h[h.length - 1] : null; } catch (e) { return null; } }
// Derive the in-book prefix + node from a move history
function bookState(history) {
  let n = BOOK, path = [];
  for (const mv of history) { if (n.children[mv]) { path.push(mv); n = n.children[mv]; } else { return { node: null, path, inBook: false }; } }
  return { node: n, path, inBook: true };
}

const PV = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 100 };
// Heuristic move when out of book, so the app keeps playing sensibly.
function fallbackMove(game, lastMove) {
  const moves = game.moves({ verbose: true });
  if (!moves.length) return null;
  if (lastMove && lastMove.to && lastMove.captured) {
    const recaps = moves.filter(m => m.to === lastMove.to && m.flags.includes('c'));
    if (recaps.length) { recaps.sort((a, b) => PV[a.piece] - PV[b.piece]); return recaps[0]; }
  }
  const safeCaps = [];
  for (const m of moves) {
    if (!m.flags.includes('c')) continue;
    const g2 = safeGame(game.fen());
    if (!safeMove(g2, { from: m.from, to: m.to, promotion: 'q' })) continue;
    const attackedBack = g2.moves({ verbose: true }).some(x => x.to === m.to);
    const gain = (PV[m.captured] || 0) - (attackedBack ? (PV[m.piece] || 0) : 0);
    if (gain > 0) safeCaps.push({ m, gain });
  }
  if (safeCaps.length) { safeCaps.sort((a, b) => b.gain - a.gain); return safeCaps[0].m; }
  const cast = moves.filter(m => m.san.startsWith('O-O'));
  if (cast.length) return cast[0];
  const dev = moves.filter(m => (m.piece === 'n' || m.piece === 'b') && !['a', 'h'].includes(m.to[0]) && !m.flags.includes('c'));
  if (dev.length) return dev[Math.floor(Math.random() * dev.length)];
  const cp = moves.filter(m => m.piece === 'p' && ['d', 'e'].includes(m.to[0]) && !m.flags.includes('c'));
  if (cp.length) return cp[0];
  const nonQ = moves.filter(m => m.piece !== 'q');
  const pool = nonQ.length ? nonQ : moves;
  return pool[Math.floor(Math.random() * pool.length)];
}

// ===== Mini analysis engine (Explorer "Libre" best-move hints) =====
// Shallow alpha-beta with a static-exchange (SEE) leaf evaluation, so it never
// recommends a capture that loses material — and stays fast & bounded on mobile.
const egVal = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };
function egEval(game) {
  const b = game.board(); let s = 0;
  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
    const p = b[r][c]; if (!p) continue;
    let v = egVal[p.type];
    const d = Math.abs(c - 3.5) + Math.abs(r - 3.5);
    if (p.type === 'p' || p.type === 'n') v += (7 - d) * 3;
    else if (p.type === 'b') v += (7 - d) * 2;
    if (p.type === 'p' && (c === 3 || c === 4) && (r === 3 || r === 4)) v += 12; // occupe le centre (d4/e4/d5/e5)
    if (p.type === 'n' || p.type === 'b') { const home = p.color === 'w' ? 7 : 0; if (r !== home) v += 8; } // développement
    s += p.color === 'w' ? v : -v;
  }
  return s;
}
function egStatic(game) { const s = egEval(game); return game.turn() === 'w' ? s : -s; }
// Static exchange evaluation on a capture (ignores x-rays/pins, good enough for hints).
function seeCapture(game, from, to) {
  const tp = game.get(to); if (!tp) return 0;
  const fp = game.get(from); const fc = fp.color;
  const wAtt = (game.attackers(to, 'w') || []).map(s => egVal[game.get(s).type]);
  const bAtt = (game.attackers(to, 'b') || []).map(s => egVal[game.get(s).type]);
  const lst = fc === 'w' ? wAtt : bAtt; const ix = lst.indexOf(egVal[fp.type]); if (ix >= 0) lst.splice(ix, 1);
  wAtt.sort((a, b) => a - b); bAtt.sort((a, b) => a - b);
  const gain = [egVal[tp.type]]; let occ = egVal[fp.type]; let side = fc === 'w' ? 'b' : 'w';
  while (true) { const list = side === 'w' ? wAtt : bAtt; if (!list.length) break; const att = list.shift(); gain.push(occ - gain[gain.length - 1]); occ = att; side = side === 'w' ? 'b' : 'w'; }
  for (let i = gain.length - 1; i > 0; i--) gain[i - 1] = -Math.max(-gain[i - 1], gain[i]);
  return gain[0];
}
// Leaf score from the side-to-move's view: material/position + the best safe capture available now.
function leafScore(game) {
  let s = egStatic(game);
  let best = 0;
  const ms = game.moves({ verbose: true });
  for (const m of ms) { if (!(m.flags.includes('c') || m.flags.includes('e'))) continue; const v = seeCapture(game, m.from, m.to); if (v > best) best = v; }
  return s + best;
}
function egOrder(game) {
  const ms = game.moves({ verbose: true });
  ms.sort((a, b) => {
    const va = a.flags.includes('c') ? ((egVal[a.captured] || 0) - (egVal[a.piece] || 0) / 10) : (a.flags.includes('p') ? 800 : 0);
    const vb = b.flags.includes('c') ? ((egVal[b.captured] || 0) - (egVal[b.piece] || 0) / 10) : (b.flags.includes('p') ? 800 : 0);
    return vb - va;
  });
  return ms;
}
function egNega(game, depth, alpha, beta, t0, tms, cnt) {
  if (Date.now() - t0 > tms || cnt.n > cnt.max) return leafScore(game);
  if (depth <= 0) return leafScore(game);
  const ms = egOrder(game);
  if (!ms.length) { try { if (game.inCheck && game.inCheck()) return -99000 - depth; } catch (e) {} return 0; }
  let best = -Infinity;
  for (const m of ms) {
    if (!safeMove(game, { from: m.from, to: m.to, promotion: m.promotion || 'q' })) continue;
    cnt.n++;
    const sc = -egNega(game, depth - 1, -beta, -alpha, t0, tms, cnt); game.undo();
    if (sc > best) best = sc;
    if (best > alpha) alpha = best;
    if (alpha >= beta) break;
    if (Date.now() - t0 > tms || cnt.n > cnt.max) break;
  }
  return best;
}
function egBest(fen, maxDepth, tms) {
  let game; try { game = new Chess(fen); } catch (e) { return null; }
  const root = egOrder(game); if (!root.length) return null;
  const keyOf = m => m.from + m.to + (m.promotion || '');
  const t0 = Date.now(); const cnt = { n: 0, max: 200000 };
  // Guaranteed depth-1 pass (cheap, SEE-validated → never a hanging move)
  let best = root[0], bestScore = -Infinity;
  { let alpha = -Infinity; const beta = Infinity;
    for (const m of root) {
      if (!safeMove(game, { from: m.from, to: m.to, promotion: m.promotion || 'q' })) continue;
      const sc = -egNega(game, 0, -beta, -alpha, t0, 1e9, cnt); game.undo();
      if (sc > bestScore) { bestScore = sc; best = m; }
      if (bestScore > alpha) alpha = bestScore;
    }
  }
  // Deeper, time-budgeted
  for (let d = 2; d <= maxDepth; d++) {
    let lb = best, ls = -Infinity, alpha = -Infinity; const beta = Infinity; let aborted = false;
    const ordered = [best, ...root.filter(m => keyOf(m) !== keyOf(best))];
    for (const m of ordered) {
      if (!safeMove(game, { from: m.from, to: m.to, promotion: m.promotion || 'q' })) continue;
      const sc = -egNega(game, d - 1, -beta, -alpha, t0, tms, cnt); game.undo();
      if (Date.now() - t0 > tms || cnt.n > cnt.max) { aborted = true; break; }
      if (sc > ls) { ls = sc; lb = m; }
      if (ls > alpha) alpha = ls;
    }
    if (!aborted) { best = lb; bestScore = ls; }
    if (aborted || Date.now() - t0 > tms || cnt.n > cnt.max) break;
  }
  return { move: best, score: bestScore };
}
// Best move for side to move + the engine's expected best reply.
function analyzePosition(fen) {
  const r1 = egBest(fen, 2, 150);
  if (!r1 || !r1.move) return null;
  const bestSan = r1.move.san;
  let replySan = null;
  try {
    const g2 = new Chess(fen);
    if (safeMove(g2, { from: r1.move.from, to: r1.move.to, promotion: r1.move.promotion || 'q' }) && !isOver(g2)) {
      const r2 = egBest(g2.fen(), 2, 90);
      if (r2 && r2.move) replySan = r2.move.san;
    }
  } catch (e) {}
  return { best: bestSan, reply: replySan };
}

// ===== Elo-scaled opponent (Explorer: app plays a side at a chosen level) =====
const ELOS = [400, 800, 1200, 1600, 2000];
function eloLabel(e) { return e <= 400 ? 'grand débutant' : e <= 800 ? 'débutant' : e <= 1200 ? 'intermédiaire' : e <= 1600 ? 'avancé' : 'expert'; }
// depth: search depth · sigma: score noise (cp) · blunder: chance of a random move · bookPlies: how long it follows opening theory
function eloParams(elo) {
  if (elo <= 400) return { depth: 1, sigma: 250, blunder: 0.12, bookPlies: 1 };
  if (elo <= 800) return { depth: 1, sigma: 150, blunder: 0.06, bookPlies: 3 };
  if (elo <= 1200) return { depth: 2, sigma: 80, blunder: 0.02, bookPlies: 6 };
  if (elo <= 1600) return { depth: 2, sigma: 35, blunder: 0.0, bookPlies: 10 };
  return { depth: 3, sigma: 12, blunder: 0.0, bookPlies: 16 };
}
function gaussRand() { let u = 0, v = 0; while (u === 0) u = Math.random(); while (v === 0) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
// Score every legal root move (depth-1 guaranteed, then refine the top with a deeper search).
function egScoredMoves(fen, depth, tms) {
  let game; try { game = new Chess(fen); } catch (e) { return []; }
  const root = egOrder(game); if (!root.length) return [];
  const t0 = Date.now(); const cnt = { n: 0, max: 200000 };
  const out = [];
  for (const m of root) {
    if (!safeMove(game, { from: m.from, to: m.to, promotion: m.promotion || 'q' })) continue;
    const sc = -egNega(game, 0, -Infinity, Infinity, t0, 1e9, cnt); game.undo();
    out.push({ move: m, score: sc });
  }
  out.sort((a, b) => b.score - a.score);
  if (depth >= 2 && out.length) {
    const r = egBest(fen, depth, tms);
    if (r && r.move) {
      const key = r.move.from + r.move.to + (r.move.promotion || '');
      const top = out.find(o => o.move.from + o.move.to + (o.move.promotion || '') === key);
      if (top) { top.score = Math.max(out[0].score, top.score) + 60; out.sort((a, b) => b.score - a.score); }
    }
  }
  return out;
}
// Pick a move at the given strength: usually noisy-best, occasionally a blunder.
function chooseEngineMove(fen, p) {
  const scored = egScoredMoves(fen, p.depth, p.depth >= 3 ? 320 : 180);
  if (!scored.length) return null;
  if (Math.random() < p.blunder) return scored[Math.floor(Math.random() * scored.length)].move;
  let bestM = scored[0].move, bestV = -Infinity;
  for (const s of scored) { const noisy = s.score + gaussRand() * p.sigma; if (noisy > bestV) { bestV = noisy; bestM = s.move; } }
  return bestM;
}
// The app's move when it plays a side: opening theory early (length scales with elo), else the elo engine.
function pickAppMove(history, elo) {
  const g = replayGame(history);
  if (isOver(g)) return null;
  const p = eloParams(elo);
  const bs = bookState(history);
  if (bs.inBook && bs.node && bs.node.order.length && history.length < p.bookPlies) return bs.node.order[0];
  const m = chooseEngineMove(g.fen(), p);
  if (m && m.san) return m.san;
  const fb = fallbackMove(g, lastVerbose(g));
  return fb ? fb.san : null;
}

// ===== Board =====
function Board({ fen, orientation = 'w', selected, targets = [], lastMove, checkSquare, hintSquare, onSquareClick, disabled }) {
  const game = safeGame(fen);
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const fileOrder = orientation === 'w' ? files : files.slice().reverse();
  const rankOrder = orientation === 'w' ? [8, 7, 6, 5, 4, 3, 2, 1] : [1, 2, 3, 4, 5, 6, 7, 8];
  const cells = [];
  for (const r of rankOrder) {
    for (const f of fileOrder) {
      const sq = f + r;
      const p = game.get(sq);
      const dark = (files.indexOf(f) + r) % 2 === 1;
      const isTarget = targets.includes(sq);
      const isLast = lastMove && (lastMove.from === sq || lastMove.to === sq);
      const showFile = orientation === 'w' ? r === 1 : r === 8;
      const showRank = orientation === 'w' ? f === 'a' : f === 'h';
      cells.push(
        <div key={sq} className={'sq ' + (dark ? 'd' : 'l') + (disabled ? ' dis' : '')} onClick={() => { if (!disabled && onSquareClick) onSquareClick(sq); }}>
          {isLast && <div className="ov ov-last" />}
          {checkSquare === sq && <div className="ov ov-check" />}
          {selected === sq && <div className="ov ov-sel" />}
          {hintSquare === sq && <div className="ov ov-hint" />}
          {p && <img className="pc" draggable={false} alt="" src={pieceImg(p.color + p.type.toUpperCase())} />}
          {isTarget && (p ? <div className="ov ov-cap" /> : <div className="dot" />)}
          {showFile && <span className="coord cf">{f}</span>}
          {showRank && <span className="coord cr">{r}</span>}
        </div>
      );
    }
  }
  return <div className="board beam">{cells}</div>;
}

// ===== Lesson / puzzle engine =====
function LineTrainer({ startFen, sequence, annotations, userColor, allowLearn, initialMode, successText, sideLabel, onComplete, onFirstAttempt }) {
  const [fen, setFen] = useState(startFen);
  const [idx, setIdx] = useState(0);
  const [mode, setMode] = useState(initialMode || (allowLearn ? 'learn' : 'train'));
  const [selected, setSelected] = useState(null);
  const [targets, setTargets] = useState([]);
  const [last, setLast] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [wrong, setWrong] = useState(0);
  const [hintSq, setHintSq] = useState(null);
  const [done, setDone] = useState(false);
  const fenRef = useRef(fen); useEffect(() => { fenRef.current = fen; }, [fen]);
  const doneRef = useRef(false);
  const failedRef = useRef(false);
  const engagedRef = useRef(false);

  const startTurn = safeGame(startFen).turn();
  const turnAt = (i) => (i % 2 === 0) ? startTurn : (startTurn === 'w' ? 'b' : 'w');
  const total = sequence.length;

  function resetAll(nextMode) {
    setFen(startFen); setIdx(0); setSelected(null); setTargets([]); setLast(null);
    setFeedback(null); setWrong(0); setHintSq(null); setDone(false);
    doneRef.current = false; failedRef.current = false; engagedRef.current = false;
    if (nextMode) setMode(nextMode);
  }

  function complete() {
    if (doneRef.current) return;
    doneRef.current = true; setDone(true);
    setFeedback({ type: 'good', text: successText });
    if (onComplete) onComplete(!failedRef.current);
  }

  // Auto-play the opponent in training mode
  useEffect(() => {
    if (mode !== 'train' || done) return;
    if (idx < total && turnAt(idx) !== userColor) {
      const id = setTimeout(() => {
        const g = safeGame(fenRef.current);
        const m = safeMove(g, sequence[idx]);
        if (!m) return;
        setFen(g.fen()); setLast({ from: m.from, to: m.to });
        if (annotations) setFeedback({ type: 'muted', text: annotations[idx] });
        const ni = idx + 1; setIdx(ni);
        if (ni >= total) complete();
      }, 470);
      return () => clearTimeout(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, mode, done]);

  function stepLearn() {
    if (done || idx >= total) return;
    const g = safeGame(fenRef.current);
    const m = safeMove(g, sequence[idx]);
    if (!m) return;
    setFen(g.fen()); setLast({ from: m.from, to: m.to });
    if (annotations) setFeedback({ type: turnAt(idx) === userColor ? 'good' : 'muted', text: annotations[idx] });
    const ni = idx + 1; setIdx(ni);
    if (ni >= total) complete();
  }

  function pickPiece(g, sq) {
    setSelected(sq);
    setTargets(g.moves({ square: sq, verbose: true }).map(m => m.to));
  }

  function handleSquare(sq) {
    if (mode !== 'train' || done) return;
    if (turnAt(idx) !== userColor) return;
    const g = safeGame(fenRef.current);
    const p = g.get(sq);
    if (selected) {
      if (sq === selected) { setSelected(null); setTargets([]); return; }
      const legalTo = g.moves({ square: selected, verbose: true }).some(m => m.to === sq);
      if (legalTo) {
        if (!engagedRef.current) { engagedRef.current = true; if (onFirstAttempt) onFirstAttempt(); }
        const tmp = safeGame(fenRef.current);
        const mv = safeMove(tmp, { from: selected, to: sq, promotion: 'q' });
        if (mv && norm(mv.san) === norm(sequence[idx])) {
          setFen(tmp.fen()); setLast({ from: selected, to: sq });
          setSelected(null); setTargets([]); setHintSq(null); setWrong(0);
          setFeedback({ type: 'good', text: annotations ? annotations[idx] : 'Bien vu !' });
          const ni = idx + 1; setIdx(ni);
          if (ni >= total) complete();
        } else {
          failedRef.current = true;
          const w = wrong + 1; setWrong(w);
          setSelected(null); setTargets([]);
          if (w >= 2) {
            setHintSq(fromOf(fenRef.current, sequence[idx]));
            setFeedback({ type: 'bad', text: `Pas ce coup-ci. Indice : joue ${moveHint(sequence[idx])} (case surlignée).` });
          } else {
            setFeedback({ type: 'bad', text: `Ce n'est pas le bon coup ici. Réessaie.` });
          }
        }
      } else if (p && p.color === userColor) {
        pickPiece(g, sq);
      } else {
        setSelected(null); setTargets([]);
      }
    } else if (p && p.color === userColor) {
      pickPiece(g, sq);
    }
  }

  const ck = checkSq(fen);
  const yourTurn = mode === 'train' && !done && turnAt(idx) === userColor;

  return (
    <div className="trainer">
      <div className="row between center">
        {allowLearn ? (
          <div className="seg">
            <button className={'segb ' + (mode === 'learn' ? 'on' : '')} onClick={() => resetAll('learn')}>Apprendre</button>
            <button className={'segb ' + (mode === 'train' ? 'on' : '')} onClick={() => resetAll('train')}>S'entraîner</button>
          </div>
        ) : <span />}
        <span className="mono dim">{idx}/{total}</span>
      </div>
      <div className="progbar"><div style={{ width: (total ? idx / total * 100 : 0) + '%' }} /></div>

      <Board fen={fen} orientation={userColor} selected={selected} targets={targets} lastMove={last}
        checkSquare={ck} hintSquare={hintSq} onSquareClick={handleSquare} disabled={mode !== 'train' || done} />

      <div className="turnline">
        {done ? <span className="turn-dot ok" /> : <span className={'turn-dot ' + (userColor === 'w' ? 'tw' : 'tb')} />}
        <span>{done ? 'Terminé' : (mode === 'learn' ? 'Mode lecture — déroule la ligne et lis chaque idée' : (yourTurn ? `À toi de jouer (${sideLabel})` : "L'adversaire réfléchit…"))}</span>
      </div>

      {feedback && <div className={'fb fb-' + feedback.type}>{feedback.text}</div>}

      <div className="row gap">
        {mode === 'learn' && !done && <button className="btn btn-primary" onClick={stepLearn}>Suivant ▸</button>}
        {(done || idx > 0) && <button className="btn btn-ghost" onClick={() => resetAll()}>Recommencer</button>}
      </div>

      {annotations && <MovesLog sequence={sequence} annotations={annotations} idx={idx} />}
    </div>
  );
}

function MovesLog({ sequence, annotations, idx }) {
  const rows = [];
  for (let i = 0; i < idx; i++) {
    const isWhite = i % 2 === 0;
    const no = Math.floor(i / 2) + 1;
    rows.push(
      <div key={i} className={'logrow ' + (i === idx - 1 ? 'cur' : '')}>
        <span className="mono lognum">{isWhite ? no + '.' : no + '…'}</span>
        <span className="mono logsan">{sanToFr(sequence[i])}</span>
        <span className="lognote">{annotations[i]}</span>
      </div>
    );
  }
  if (!rows.length) return null;
  return <div className="log">{rows.reverse()}</div>;
}

// ===== Stat ring =====
function Ring({ pct = 0, size = 60 }) {
  const r = (size - 9) / 2, c = 2 * Math.PI * r;
  const off = c * (1 - Math.max(0, Math.min(1, pct)));
  return (
    <svg width={size} height={size} className="ring">
      <circle cx={size / 2} cy={size / 2} r={r} className="ring-bg" />
      <circle cx={size / 2} cy={size / 2} r={r} className="ring-fg" strokeDasharray={c} strokeDashoffset={off}
        transform={`rotate(-90 ${size / 2} ${size / 2})`} />
    </svg>
  );
}

// ===== Icons =====
const IconBook = () => (<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z" /><path d="M20 18v3H6.5A2.5 2.5 0 0 1 4 18.5" /></svg>);
const IconBolt = () => (<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 4 14h7l-1 8 9-12h-7z" /></svg>);
const IconChart = () => (<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20V10M10 20V4M16 20v-6M22 20H2" /></svg>);
const IconScope = () => (<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="M11 7v8M7 11h8M20 20l-3.2-3.2" /></svg>);
const IconFlag = () => (<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M5 21V4M5 4h12l-2.5 3.5L17 11H5" /></svg>);
const IconKnight = () => (<img className="knish" alt="" src={pieceImg('wN')} />);
const TABS = [
  { id: 'principes', label: 'Principes', icon: <IconBook /> },
  { id: 'ouvertures', label: 'Ouvertures', icon: <IconKnight /> },
  { id: 'tactiques', label: 'Tactiques', icon: <IconBolt /> },
  { id: 'finales', label: 'Finales', icon: <IconFlag /> },
  { id: 'analyse', label: 'Analyse', icon: <IconScope /> },
  { id: 'progres', label: 'Progrès', icon: <IconChart /> },
];

// ===== Views =====
function PrinciplesView() {
  return (
    <div className="view">
      <div className="card hot">
        <div className="hot-k">Le réflexe à 300 elo</div>
        <div className="hot-t">{HIGHLIGHT.title}</div>
        <p className="hot-x">{HIGHLIGHT.text}</p>
      </div>
      <h2 className="sec">Les 7 principes d'ouverture</h2>
      <div className="plist">
        {PRINCIPLES.map((p, i) => (
          <div className="card pcard" key={i}>
            <div className="pnum mono">{i + 1}</div>
            <div><div className="ptitle">{p.title}</div><p className="ptext">{p.text}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RepertoireView({ st, openId, setOpenId, onMaster }) {
  const op = OPENINGS.find(o => o.id === openId);
  if (op) {
    return (
      <div>
        <button className="back" onClick={() => setOpenId(null)}>← Tout le répertoire</button>
        <div className="ohead">
          <div className="row gap center">
            <span className={'cchip ' + (op.color === 'Blancs' ? 'cw' : 'cb')}>{op.color}</span>
            {st.mastered.includes(op.id) && <span className="masterbadge">✓ vue</span>}
          </div>
          <h2 className="otitle">{op.name}</h2>
          <p className="odesc">{op.desc}</p>
        </div>
        <LineTrainer key={op.id} startFen={START_FEN} sequence={op.moves} annotations={op.notes}
          userColor={op.color === 'Blancs' ? 'w' : 'b'} allowLearn initialMode="learn" sideLabel={op.color}
          successText={'Ligne terminée — tu connais les idées de ' + op.name + ' 🎉'}
          onComplete={() => onMaster(op.id)} />
      </div>
    );
  }
  const groups = [['Blancs', 'Avec les Blancs'], ['Noirs', 'Avec les Noirs']];
  return (
    <div>
      <p className="lead">Apprends les idées (mode lecture), puis rejoue-les de mémoire (entraînement). Comprends le « pourquoi » de chaque coup.</p>
      {groups.map(([col, label]) => (
        <div key={col} className="ogroup">
          <h3 className="ogrp">{label}</h3>
          <div className="olist">
            {OPENINGS.filter(o => o.color === col).map(o => (
              <button className="card ocard" key={o.id} onClick={() => setOpenId(o.id)}>
                <div className="row between center">
                  <span className={'cchip ' + (o.color === 'Blancs' ? 'cw' : 'cb')}>{o.color}</span>
                  {st.mastered.includes(o.id) ? <span className="masterbadge">✓ vue</span> : <span className="mono dim">{o.moves.length} demi-coups</span>}
                </div>
                <div className="ocard-t">{o.name}</div>
                <div className="ocard-d">{o.short}</div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ExplorerView() {
  const [history, setHistory] = useState([]);
  const [appSide, setAppSide] = useState('w'); // 'w' | 'b' | null (libre)
  const [elo, setElo] = useState(800);
  const [flip, setFlip] = useState(false);
  const [selected, setSelected] = useState(null);
  const [targets, setTargets] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const runRef = useRef(0);
  const histRef = useRef(history); useEffect(() => { histRef.current = history; }, [history]);
  const eloRef = useRef(elo); useEffect(() => { eloRef.current = elo; }, [elo]);

  const game = replayGame(history);
  const fen = game.fen();
  const turn = game.turn();
  const over = isOver(game);
  const { node, path, inBook } = bookState(history);
  const bookMoves = inBook && node ? node.order : [];
  const name = openingNameFor(path);
  const lm = lastVerbose(game);
  const lastMove = lm ? { from: lm.from, to: lm.to } : null;
  const hugoSide = appSide ? (appSide === 'w' ? 'b' : 'w') : turn;
  const orientation = appSide ? (appSide === 'w' ? 'b' : 'w') : (flip ? 'b' : 'w');
  const movableColor = appSide ? hugoSide : turn;
  const canMove = !over && (appSide ? turn === hugoSide : true);
  const ck = checkSq(fen);

  useEffect(() => {
    if (!appSide) return;
    const g = replayGame(histRef.current);
    if (isOver(g) || g.turn() !== appSide) return;
    const id = setTimeout(() => {
      const h = histRef.current;
      const g2 = replayGame(h);
      if (isOver(g2) || g2.turn() !== appSide) return;
      const san = pickAppMove(h, eloRef.current);
      if (san) setHistory(prev => [...prev, san]);
    }, 480);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, appSide]);

  // Libre only: suggest the best move for the side to move + best reply
  useEffect(() => {
    if (appSide !== null) { setAnalysis(null); setAnalyzing(false); return; }
    const g = replayGame(history);
    if (isOver(g)) { setAnalysis(null); setAnalyzing(false); return; }
    const myRun = ++runRef.current;
    setAnalyzing(true);
    const fenNow = g.fen();
    const id = setTimeout(() => {
      if (runRef.current !== myRun) return;
      let res = null;
      try { res = analyzePosition(fenNow); } catch (e) { res = null; }
      if (runRef.current !== myRun) return;
      setAnalysis(res ? { side: g.turn(), best: res.best, reply: res.reply } : null);
      setAnalyzing(false);
    }, 30);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, appSide]);

  function playSan(san) { setHistory(prev => [...prev, san]); setSelected(null); setTargets([]); }

  function onSquare(sq) {
    if (!canMove) return;
    const g = replayGame(history);
    const p = g.get(sq);
    if (selected) {
      if (sq === selected) { setSelected(null); setTargets([]); return; }
      const legal = g.moves({ square: selected, verbose: true }).some(m => m.to === sq);
      if (legal) {
        const tmp = replayGame(history);
        const mv = safeMove(tmp, { from: selected, to: sq, promotion: 'q' });
        if (mv) playSan(mv.san);
      } else if (p && p.color === movableColor) {
        setSelected(sq); setTargets(g.moves({ square: sq, verbose: true }).map(m => m.to));
      } else { setSelected(null); setTargets([]); }
    } else if (p && p.color === movableColor) {
      setSelected(sq); setTargets(g.moves({ square: sq, verbose: true }).map(m => m.to));
    }
  }

  function chooseSide(s) { setAppSide(s); setHistory([]); setSelected(null); setTargets([]); }
  function undo() {
    setSelected(null); setTargets([]);
    setHistory(prev => {
      if (!prev.length) return prev;
      let nh = prev.slice(0, -1);
      if (appSide && nh.length && replayGame(nh).turn() === appSide) nh = nh.slice(0, -1);
      return nh;
    });
  }
  function reset() { setHistory([]); setSelected(null); setTargets([]); }

  const sanHist = (() => { try { return game.history(); } catch (e) { return []; } })();

  return (
    <div className="explorer">
      <div className="seg seg-top">
        <button className={'segb ' + (appSide === 'w' ? 'on' : '')} onClick={() => chooseSide('w')}>App : Blancs</button>
        <button className={'segb ' + (appSide === 'b' ? 'on' : '')} onClick={() => chooseSide('b')}>App : Noirs</button>
        <button className={'segb ' + (appSide === null ? 'on' : '')} onClick={() => chooseSide(null)}>Libre</button>
      </div>

      {appSide && (
        <div className="elorow">
          <div className="row between center">
            <span className="elolbl">Niveau de l'app</span>
            <span className="mono elonow">{elo === 2000 ? 'Max' : elo} · {eloLabel(elo)}</span>
          </div>
          <div className="elochips">
            {ELOS.map(e => (
              <button key={e} className={'elochip ' + (elo === e ? 'on' : '')} onClick={() => setElo(e)}>{e === 2000 ? 'Max' : e}</button>
            ))}
          </div>
        </div>
      )}

      <p className="lead">{appSide === null
        ? `Tu joues les deux camps librement. Après chaque coup, l'app analyse la position et t'indique le meilleur coup à jouer (et la meilleure réponse adverse).`
        : `Joue contre l'app : elle suit la théorie en début de partie, puis joue au niveau choisi. Déplace tes pièces, elle répond.`}</p>

      <div className="card openname-card">
        <div className="hot-k">{inBook ? 'Répertoire' : 'Hors répertoire'}</div>
        <div className="openname">{name || (history.length ? 'Début de partie' : 'Position de départ')}</div>
      </div>

      <Board fen={fen} orientation={orientation} selected={selected} targets={targets} lastMove={lastMove}
        checkSquare={ck} onSquareClick={onSquare} disabled={!canMove} />

      {appSide === null && (
        <button className="flipbtn" onClick={() => setFlip(f => !f)}>⇅ Vue {flip ? 'Blancs' : 'Noirs'}</button>
      )}

      <div className="turnline">
        {over ? <span className="turn-dot ok" /> : <span className={'turn-dot ' + (turn === 'w' ? 'tw' : 'tb')} />}
        <span>{over
          ? ((game.isCheckmate && game.isCheckmate()) ? 'Échec et mat' : 'Partie terminée')
          : (appSide ? (canMove ? `À toi (${hugoSide === 'w' ? 'Blancs' : 'Noirs'})` : "L'app réfléchit…") : `Trait aux ${turn === 'w' ? 'Blancs' : 'Noirs'} — tu joues les deux`)}</span>
      </div>

      {appSide === null && !over && (
        <div className="card analysis">
          <div className="hot-k">Analyse — meilleur coup</div>
          {analyzing && <div className="dim ana-wait">Calcul du meilleur coup…</div>}
          {!analyzing && analysis && analysis.best && (
            <div className="ana-rows">
              <div className="ana-row">
                <span className="alabel">{analysis.side === 'w' ? 'Blancs' : 'Noirs'} <span className="dim">au trait</span></span>
                <button className="bookchip main anachip" onClick={() => playSan(analysis.best)}>
                  <span className="mono bcsan">{sanToFr(analysis.best)}</span>
                </button>
              </div>
              {analysis.reply && (
                <div className="ana-row">
                  <span className="alabel">{analysis.side === 'w' ? 'Noirs' : 'Blancs'} <span className="dim">réponse</span></span>
                  <span className="mono areply">{sanToFr(analysis.reply)}</span>
                </div>
              )}
            </div>
          )}
          {!analyzing && (!analysis || !analysis.best) && <div className="dim">—</div>}
        </div>
      )}

      {canMove && bookMoves.length > 0 && (
        <div>
          <div className="dim booklbl">Coups du répertoire ici :</div>
          <div className="booklist">
            {bookMoves.map((mv, i) => {
              const childName = openingNameFor([...path, mv]);
              return (
                <button key={mv} className={'bookchip ' + (i === 0 ? 'main' : '')} onClick={() => playSan(mv)}>
                  <span className="mono bcsan">{sanToFr(mv)}</span>
                  {childName && childName !== name && <span className="bcname">{childName}</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}
      {canMove && bookMoves.length === 0 && !over && (
        <div className="fb fb-muted">Tu es sorti du répertoire connu — joue librement, l'app improvise un coup sensé.</div>
      )}

      <div className="row gap">
        <button className="btn btn-ghost" onClick={undo} disabled={!history.length}>↶ Annuler</button>
        <button className="btn btn-ghost" onClick={reset} disabled={!history.length}>Réinitialiser</button>
      </div>

      {sanHist.length > 0 && (
        <div className="histline mono">
          {sanHist.map((s, i) => (
            <span key={i} className="hmv">{i % 2 === 0 && <b className="hn">{Math.floor(i / 2) + 1}.</b>}<span className="hs">{sanToFr(s)}</span></span>
          ))}
        </div>
      )}
    </div>
  );
}

function OuverturesView({ st, onMaster }) {
  const [sub, setSub] = useState('repertoire');
  const [openId, setOpenId] = useState(null);
  return (
    <div className="view">
      <div className="seg seg-top">
        <button className={'segb ' + (sub === 'repertoire' ? 'on' : '')} onClick={() => setSub('repertoire')}>Répertoire</button>
        <button className={'segb ' + (sub === 'explorer' ? 'on' : '')} onClick={() => setSub('explorer')}>Explorer</button>
      </div>
      {sub === 'explorer'
        ? <ExplorerView />
        : <RepertoireView st={st} openId={openId} setOpenId={setOpenId} onMaster={onMaster} />}
    </div>
  );
}

function TacticsView({ st, pzIdx, setPzIdx, onAttempt, onSolved }) {
  const pz = PUZZLES[pzIdx];
  const [solvedNow, setSolvedNow] = useState(false);
  useEffect(() => { setSolvedNow(false); }, [pzIdx]);
  const next = () => setPzIdx((pzIdx + 1) % PUZZLES.length);
  const shuffle = () => { let n = pzIdx; if (PUZZLES.length > 1) { while (n === pzIdx) n = Math.floor(Math.random() * PUZZLES.length); } setPzIdx(n); };
  return (
    <div className="view">
      <div className="row between center">
        <h2 className="sec nomar">Tactiques</h2>
        <span className="mono dim">{pzIdx + 1}/{PUZZLES.length}</span>
      </div>
      <p className="lead">Trouve le meilleur coup. La plupart des parties à 300 elo se décident ici : un mat simple, une pièce en prise, une fourchette.</p>
      <div className="card tcard">
        <div className="row between center mb">
          <span className="tag">{pz.theme}</span>
          <span className={'cchip ' + (pz.side === 'w' ? 'cw' : 'cb')}>Trait aux {pz.side === 'w' ? 'Blancs' : 'Noirs'}</span>
        </div>
        <LineTrainer key={pzIdx} startFen={pz.fen} sequence={pz.solution} annotations={null}
          userColor={pz.side} allowLearn={false} initialMode="train" sideLabel={pz.side === 'w' ? 'Blancs' : 'Noirs'}
          successText={pz.explain} onFirstAttempt={() => onAttempt(pz.id)}
          onComplete={(clean) => { onSolved(pz.id, clean); setSolvedNow(true); }} />
        <div className="row gap mt">
          <button className="btn btn-primary" onClick={next}>{solvedNow ? 'Puzzle suivant ▸' : 'Passer ▸'}</button>
          <button className="btn btn-ghost" onClick={shuffle}>Mélanger</button>
        </div>
      </div>
    </div>
  );
}

function ProgressView({ st, onReset }) {
  const opPct = OPENINGS.length ? st.mastered.length / OPENINGS.length : 0;
  const pzPct = PUZZLES.length ? st.solved.length / PUZZLES.length : 0;
  const acc = st.attempts > 0 ? Math.round(st.clean / st.attempts * 100) : 0;
  return (
    <div className="view">
      <h2 className="sec">Ta progression</h2>
      <div className="card streakcard">
        <div className="flame">🔥</div>
        <div className="bignum mono">{st.streak}</div>
        <div className="biglbl">jour{st.streak > 1 ? 's' : ''} de suite</div>
        <div className="subnum mono">record · {st.best}</div>
      </div>
      <div className="grid2">
        <div className="card statcard">
          <Ring pct={opPct} />
          <div className="statn mono">{st.mastered.length}/{OPENINGS.length}</div>
          <div className="statl">Ouvertures vues</div>
        </div>
        <div className="card statcard">
          <Ring pct={pzPct} />
          <div className="statn mono">{st.solved.length}/{PUZZLES.length}</div>
          <div className="statl">Tactiques résolues</div>
        </div>
      </div>
      <div className="card statwide">
        <div className="row between center">
          <div><div className="statl">Précision (1er essai)</div><div className="statn mono big">{acc}%</div></div>
          <Ring pct={acc / 100} />
        </div>
      </div>
      {st.mastered.length > 0 && (
        <div className="card">
          <div className="statl mb">Ouvertures maîtrisées</div>
          <div className="chips">{st.mastered.map(id => { const o = OPENINGS.find(x => x.id === id); return o ? <span className="chip" key={id}>{o.name}</span> : null; })}</div>
        </div>
      )}
      <button className="resetbtn" onClick={() => { if (window.confirm('Réinitialiser toute la progression ?')) onReset(); }}>Réinitialiser la progression</button>
    </div>
  );
}

// ===== Stockfish engine client (bundled, same-origin Web Worker) =====
let _sf = null;
function getSF() {
  if (_sf) return _sf;
  const api = { worker: null, ready: false, failed: false, q: [], cur: null, onready: [] };
  function pump() {
    if (!api.ready || api.cur || !api.q.length) return;
    const job = api.q.shift(); api.cur = job; job.lastType = null; job.lastVal = null;
    try {
      api.worker.postMessage('position fen ' + job.fen);
      api.worker.postMessage('go depth ' + job.depth);
      job.timer = setTimeout(() => { try { api.worker.postMessage('stop'); } catch (e) {} }, 7000);
    } catch (e) { job.resolve(null); api.cur = null; }
  }
  try { api.worker = new Worker('/stockfish.js'); }
  catch (e) { api.failed = true; return (_sf = api); }
  api.worker.onmessage = (e) => {
    const line = typeof e.data === 'string' ? e.data : (e.data && e.data.data) || '';
    if (!line) return;
    if (line.indexOf('uciok') === 0) { try { api.worker.postMessage('isready'); } catch (er) {} return; }
    if (line.indexOf('readyok') === 0) { if (!api.ready) { api.ready = true; api.onready.splice(0).forEach(fn => fn(true)); pump(); } return; }
    const sm = /score (cp|mate) (-?\d+)/.exec(line);
    if (sm && api.cur) { api.cur.lastType = sm[1]; api.cur.lastVal = parseInt(sm[2], 10); }
    if (line.indexOf('bestmove') === 0 && api.cur) {
      const job = api.cur; api.cur = null; if (job.timer) clearTimeout(job.timer);
      const bm = line.split(/\s+/)[1] || null;
      job.resolve({ type: job.lastType, val: job.lastVal, bestUci: (bm && bm !== '(none)') ? bm : null });
      pump();
    }
  };
  api.worker.onerror = () => { api.failed = true; if (api.cur) { api.cur.resolve(null); api.cur = null; } api.q.splice(0).forEach(j => j.resolve(null)); api.onready.splice(0).forEach(fn => fn(false)); };
  api.evaluate = (fen, depth) => new Promise((resolve) => { if (api.failed) return resolve(null); api.q.push({ fen, depth, resolve }); pump(); });
  api.whenReady = () => new Promise((resolve) => { if (api.ready) return resolve(true); if (api.failed) return resolve(false); api.onready.push(resolve); });
  try { api.worker.postMessage('uci'); } catch (e) { api.failed = true; }
  setTimeout(() => { if (!api.ready && !api.failed) { api.failed = true; api.onready.splice(0).forEach(fn => fn(false)); } }, 12000);
  return (_sf = api);
}

// ===== Analysis helpers (chess.com-style review) =====
function scoreToCp(r) { if (!r || r.type == null) return 0; if (r.type === 'mate') return r.val > 0 ? 100000 - r.val * 100 : -100000 - r.val * 100; return r.val || 0; }
function winPct(cp) { const c = Math.max(-1500, Math.min(1500, cp)); return 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * c)) - 1); }
function classifyCPL(c) { if (c <= 10) return 'Meilleur'; if (c <= 25) return 'Excellent'; if (c <= 50) return 'Bien'; if (c <= 100) return 'Imprécision'; if (c <= 250) return 'Erreur'; return 'Gaffe'; }
function moveAcc(wb, wa) { const d = Math.max(0, wb - wa); return Math.max(0, Math.min(100, 103.1668 * Math.exp(-0.04354 * d) - 3.1669)); }
const CLS_CLASS = { 'Théorie': 'b-book', 'Meilleur': 'b-best', 'Excellent': 'b-exc', 'Bien': 'b-good', 'Imprécision': 'b-inacc', 'Erreur': 'b-mistake', 'Gaffe': 'b-blunder' };
function parseGame(pgn) {
  const g = new Chess();
  try { g.loadPgn(pgn); } catch (e) { /* keep whatever parsed */ }
  let moves = [];
  try { moves = g.history(); } catch (e) { moves = []; }
  if (!moves.length) return null;
  let headers = {}; try { headers = g.header() || {}; } catch (e) {}
  return { moves, headers };
}
const RESULT_DRAW = ['stalemate', 'agreed', 'repetition', 'insufficient', '50move', 'timevsinsufficient'];
async function fetchChessCom(username) {
  const u = (username || '').trim().toLowerCase().replace(/^@/, '');
  if (!u) throw new Error('pseudo vide');
  const ar = await fetch('https://api.chess.com/pub/player/' + encodeURIComponent(u) + '/games/archives');
  if (!ar.ok) throw new Error('joueur introuvable');
  const aj = await ar.json();
  const urls = (aj.archives || []).slice(-3).reverse();
  let all = [];
  for (const url of urls) { const r = await fetch(url); if (!r.ok) continue; const j = await r.json(); all = all.concat(j.games || []); if (all.length >= 30) break; }
  all = all.filter(x => x.pgn && x.rules === 'chess').sort((a, b) => (b.end_time || 0) - (a.end_time || 0)).slice(0, 16);
  if (!all.length) throw new Error('aucune partie récente');
  return all.map(g => {
    const me = (g.white && g.white.username && g.white.username.toLowerCase() === u) ? 'w' : 'b';
    const mine = me === 'w' ? g.white : g.black; const opp = me === 'w' ? g.black : g.white;
    const res = mine ? mine.result : null;
    const youRes = res === 'win' ? 'Victoire' : (RESULT_DRAW.includes(res) ? 'Nulle' : 'Défaite');
    return { pgn: g.pgn, youColor: me, youName: mine ? mine.username : '?', oppName: opp ? opp.username : '?', oppRating: opp ? opp.rating : null, youRating: mine ? mine.rating : null, youRes, timeClass: g.time_class || '', endTime: g.end_time || 0 };
  });
}
function fmtDate(ts) { if (!ts) return ''; try { return new Date(ts * 1000).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }); } catch (e) { return ''; } }

function AnalyseView() {
  const [username, setUsername] = useState('');
  const [games, setGames] = useState([]);
  const [loadingGames, setLoadingGames] = useState(false);
  const [gamesErr, setGamesErr] = useState(null);
  const [showPaste, setShowPaste] = useState(false);
  const [pgnText, setPgnText] = useState('');
  const [game, setGame] = useState(null);
  const [level, setLevel] = useState(11);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [engineErr, setEngineErr] = useState(null);
  const [result, setResult] = useState(null);
  const [viewPly, setViewPly] = useState(0);
  const runRef = useRef(0);

  async function doLoadGames() {
    setGamesErr(null); setLoadingGames(true); setGames([]); setGame(null); setResult(null);
    try { const list = await fetchChessCom(username); setGames(list); }
    catch (e) { setGamesErr("Impossible de charger les parties (" + (e.message || 'erreur') + "). Vérifie le pseudo, ou colle un PGN."); }
    setLoadingGames(false);
  }
  function selectGame(meta) {
    const parsed = parseGame(meta.pgn);
    if (!parsed) { setGamesErr('PGN illisible pour cette partie.'); return; }
    setGame({ moves: parsed.moves, youColor: meta.youColor, youName: meta.youName, oppName: meta.oppName,
      whiteName: meta.youColor === 'w' ? meta.youName : meta.oppName, blackName: meta.youColor === 'w' ? meta.oppName : meta.youName,
      resultText: parsed.headers.Result || '', youRes: meta.youRes });
    setResult(null); setViewPly(0); setEngineErr(null); setProgress(0);
  }
  function loadPasted() {
    const parsed = parseGame(pgnText);
    if (!parsed) { setGamesErr('PGN illisible. Vérifie le format (copie le PGN complet).'); return; }
    const h = parsed.headers;
    setGame({ moves: parsed.moves, youColor: 'w', youName: h.White || 'Blancs', oppName: h.Black || 'Noirs',
      whiteName: h.White || 'Blancs', blackName: h.Black || 'Noirs', resultText: h.Result || '', youRes: null });
    setResult(null); setViewPly(0); setEngineErr(null); setGamesErr(null); setProgress(0); setGames([]);
  }
  async function runAnalysis() {
    if (!game) return;
    setEngineErr(null); setResult(null); setProgress(0); setAnalyzing(true);
    const token = ++runRef.current;
    const eng = getSF();
    const ok = await eng.whenReady();
    if (!ok) { if (token === runRef.current) { setEngineErr("Le moteur d'analyse n'a pas pu démarrer dans ce navigateur. Réessaie, ou utilise un autre navigateur (Chrome/Safari récents)."); setAnalyzing(false); } return; }
    const g = new Chess(); const fens = [g.fen()];
    for (const m of game.moves) { if (!safeMove(g, m)) break; fens.push(g.fen()); }
    const evals = new Array(fens.length); const bu = new Array(fens.length);
    for (let i = 0; i < fens.length; i++) {
      if (token !== runRef.current) return;
      const r = await eng.evaluate(fens[i], level);
      if (token !== runRef.current) return;
      if (!r) { setEngineErr("L'analyse s'est interrompue. Réessaie."); setAnalyzing(false); return; }
      const stm = fens[i].split(' ')[1];
      const cp = scoreToCp(r);
      evals[i] = stm === 'w' ? cp : -cp;
      bu[i] = r.bestUci;
      setProgress(Math.round(((i + 1) / fens.length) * 100));
    }
    const plies = []; const accW = []; const accB = [];
    for (let i = 0; i < game.moves.length; i++) {
      const mw = (i % 2 === 0); const Ei = evals[i], Ej = evals[i + 1];
      const cpl = Math.max(0, (mw ? Ei : -Ei) - (mw ? Ej : -Ej));
      let bestSan = null;
      try { const t = new Chess(fens[i]); const b = bu[i]; if (b) { const mv = t.move({ from: b.slice(0, 2), to: b.slice(2, 4), promotion: b.length > 4 ? b[4] : undefined }); if (mv) bestSan = mv.san; } } catch (e) {}
      let aUci = null;
      try { const t = new Chess(fens[i]); const mv = t.move(game.moves[i]); if (mv) aUci = mv.from + mv.to + (mv.promotion || ''); } catch (e) {}
      const isBest = bu[i] && aUci && aUci === bu[i];
      const inBook = bookState(game.moves.slice(0, i + 1)).inBook;
      const cls = inBook ? 'Théorie' : ((isBest || cpl <= 10) ? 'Meilleur' : classifyCPL(cpl));
      plies.push({ ply: i, san: game.moves[i], cls, cpl: Math.round(cpl), bestSan, evalAfter: Ej });
      const wb = mw ? winPct(Ei) : 100 - winPct(Ei), wa = mw ? winPct(Ej) : 100 - winPct(Ej);
      (mw ? accW : accB).push(moveAcc(wb, wa));
    }
    const avg = a => a.length ? Math.round((a.reduce((x, y) => x + y, 0) / a.length) * 10) / 10 : 100;
    if (token !== runRef.current) return;
    setResult({ evals, plies, accW: avg(accW), accB: avg(accB), fens });
    setViewPly(game.moves.length); setAnalyzing(false);
  }

  const boardMoves = game ? game.moves.slice(0, viewPly) : [];
  const bg = replayGame(boardMoves);
  const bfen = bg.fen();
  const blast = (() => { try { const h = bg.history({ verbose: true }); return h.length ? { from: h[h.length - 1].from, to: h[h.length - 1].to } : null; } catch (e) { return null; } })();
  const orient = game ? game.youColor : 'w';
  const ck = checkSq(bfen);
  const keyMoments = result ? result.plies.filter(p => p.cls === 'Erreur' || p.cls === 'Gaffe').sort((a, b) => b.cpl - a.cpl).slice(0, 5) : [];
  const youAcc = game ? (game.youColor === 'w' ? (result && result.accW) : (result && result.accB)) : null;
  const oppAcc = game ? (game.youColor === 'w' ? (result && result.accB) : (result && result.accW)) : null;

  const GW = 320, GH = 60, CAP = 800;
  const graphPts = result ? result.evals.map((e, i) => {
    const x = result.evals.length > 1 ? (i / (result.evals.length - 1)) * GW : 0;
    const y = GH / 2 - Math.max(-CAP, Math.min(CAP, e)) / CAP * (GH / 2 - 3);
    return x.toFixed(1) + ',' + y.toFixed(1);
  }).join(' ') : '';

  return (
    <div className="view">
      <h2 className="sec">Analyse de parties</h2>

      {!game && (
        <>
          <p className="lead">Récupère tes parties chess.com et fais-les analyser par Stockfish : précision, qualité de chaque coup et moments-clés.</p>
          <div className="card loadcard">
            <label className="flbl">Ton pseudo chess.com</label>
            <div className="row gap">
              <input className="tin" value={username} placeholder="ex. magnuscarlsen" onChange={e => setUsername(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') doLoadGames(); }} autoCapitalize="none" autoCorrect="off" spellCheck={false} />
              <button className="btn btn-primary" onClick={doLoadGames} disabled={loadingGames}>{loadingGames ? '…' : 'Charger'}</button>
            </div>
            <button className="linklike" onClick={() => setShowPaste(s => !s)}>{showPaste ? '— masquer' : 'ou coller un PGN'}</button>
            {showPaste && (
              <div className="pastebox">
                <textarea className="tarea" rows={5} value={pgnText} placeholder="Colle ici le PGN complet d'une partie…" onChange={e => setPgnText(e.target.value)} />
                <button className="btn btn-ghost" onClick={loadPasted}>Charger ce PGN</button>
              </div>
            )}
          </div>
          {gamesErr && <div className="fb fb-bad">{gamesErr}</div>}
          {games.length > 0 && (
            <div className="gamelist">
              {games.map((g, i) => (
                <button key={i} className="card gamerow" onClick={() => selectGame(g)}>
                  <span className={'rdot ' + (g.youRes === 'Victoire' ? 'rw' : g.youRes === 'Nulle' ? 'rd' : 'rl')} />
                  <div className="grow-main">
                    <div className="grow-t">vs {g.oppName} {g.oppRating ? <span className="dim">({g.oppRating})</span> : null}</div>
                    <div className="grow-s mono dim">{g.youColor === 'w' ? 'Blancs' : 'Noirs'} · {g.timeClass} · {fmtDate(g.endTime)}</div>
                  </div>
                  <span className={'gres ' + (g.youRes === 'Victoire' ? 'gw' : g.youRes === 'Nulle' ? 'gd' : 'gl')}>{g.youRes}</span>
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {game && (
        <>
          <button className="back" onClick={() => { setGame(null); setResult(null); }}>← Autres parties</button>
          <div className="card ghead">
            <div className="gh-title">{game.whiteName} <span className="dim">—</span> {game.blackName}</div>
            <div className="gh-sub mono dim">{game.resultText} · {game.moves.length} demi-coups{game.youRes ? ' · ' + game.youRes : ''}</div>
          </div>

          {!result && !analyzing && (
            <div className="card">
              <div className="flbl">Profondeur d'analyse</div>
              <div className="seg seg-top">
                <button className={'segb ' + (level === 8 ? 'on' : '')} onClick={() => setLevel(8)}>Rapide</button>
                <button className={'segb ' + (level === 11 ? 'on' : '')} onClick={() => setLevel(11)}>Standard</button>
                <button className={'segb ' + (level === 14 ? 'on' : '')} onClick={() => setLevel(14)}>Profond</button>
              </div>
              <button className="btn btn-primary full" onClick={runAnalysis}>Analyser la partie</button>
              <div className="dim tiny">L'analyse tourne dans ton navigateur. Compte ~15 s (Rapide) à ~1 min (Profond) selon la longueur.</div>
              {engineErr && <div className="fb fb-bad">{engineErr}</div>}
            </div>
          )}

          {analyzing && (
            <div className="card">
              <div className="row between center"><span className="flbl">Analyse en cours…</span><span className="mono gold">{progress}%</span></div>
              <div className="pbar"><div className="pbar-fg" style={{ width: progress + '%' }} /></div>
            </div>
          )}

          <Board fen={bfen} orientation={orient} lastMove={blast} checkSquare={ck} disabled />

          <div className="row between center navrow">
            <button className="btn btn-ghost" onClick={() => setViewPly(0)} disabled={viewPly === 0}>⏮</button>
            <button className="btn btn-ghost" onClick={() => setViewPly(p => Math.max(0, p - 1))} disabled={viewPly === 0}>◀</button>
            <span className="mono dim navnum">{viewPly} / {game.moves.length}</span>
            <button className="btn btn-ghost" onClick={() => setViewPly(p => Math.min(game.moves.length, p + 1))} disabled={viewPly >= game.moves.length}>▶</button>
            <button className="btn btn-ghost" onClick={() => setViewPly(game.moves.length)} disabled={viewPly >= game.moves.length}>⏭</button>
          </div>

          {result && (
            <>
              <div className="card accrow">
                <div className="acccol">
                  <div className="accnum" style={{ color: 'var(--gold2)' }}>{youAcc}</div>
                  <div className="acclbl">Toi <span className="dim">({game.youColor === 'w' ? 'Blancs' : 'Noirs'})</span></div>
                </div>
                <div className="accvs dim">précision</div>
                <div className="acccol">
                  <div className="accnum">{oppAcc}</div>
                  <div className="acclbl">{game.oppName}</div>
                </div>
              </div>

              <div className="card">
                <div className="flbl">Évaluation</div>
                <svg className="evalgraph" viewBox={'0 0 ' + GW + ' ' + GH} preserveAspectRatio="none"
                  onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width; setViewPly(Math.max(0, Math.min(game.moves.length, Math.round(x * (result.evals.length - 1))))); }}>
                  <rect x="0" y="0" width={GW} height={GH / 2} className="eg-wtop" />
                  <rect x="0" y={GH / 2} width={GW} height={GH / 2} className="eg-wbot" />
                  <line x1="0" y1={GH / 2} x2={GW} y2={GH / 2} className="eg-mid" />
                  <polyline points={graphPts} className="eg-line" />
                  <line x1={(viewPly / Math.max(1, result.evals.length - 1)) * GW} y1="0" x2={(viewPly / Math.max(1, result.evals.length - 1)) * GW} y2={GH} className="eg-cursor" />
                </svg>
              </div>

              {keyMoments.length > 0 && (
                <div className="card">
                  <div className="flbl">Moments-clés</div>
                  {keyMoments.map((p, i) => (
                    <button key={i} className="keymo" onClick={() => setViewPly(p.ply + 1)}>
                      <span className={'badge ' + CLS_CLASS[p.cls]}>{p.cls}</span>
                      <span className="km-txt">{Math.floor(p.ply / 2) + 1}{p.ply % 2 === 0 ? '.' : '…'} {sanToFr(p.san)}{p.bestSan ? <span className="dim"> — mieux : {sanToFr(p.bestSan)}</span> : null}</span>
                    </button>
                  ))}
                </div>
              )}

              <div className="movelist">
                {result.plies.map((p, i) => (
                  <button key={i} className={'mlrow ' + (viewPly === p.ply + 1 ? 'on' : '')} onClick={() => setViewPly(p.ply + 1)}>
                    <span className="ml-n mono dim">{p.ply % 2 === 0 ? (Math.floor(p.ply / 2) + 1) + '.' : ''}</span>
                    <span className="ml-san mono">{sanToFr(p.san)}</span>
                    <span className={'badge ' + CLS_CLASS[p.cls]}>{p.cls}</span>
                    {(p.cls === 'Imprécision' || p.cls === 'Erreur' || p.cls === 'Gaffe') && p.bestSan && <span className="ml-best dim">→ {sanToFr(p.bestSan)}</span>}
                  </button>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

// ===== Finales (endgame trainer vs Stockfish) =====
function replayFrom(fen, sans) { const g = safeGame(fen); for (const s of (sans || [])) { if (!safeMove(g, s)) break; } return g; }
const ENDGAMES = [
  { id: 'q', name: 'Mater avec la Dame', goal: 'mate', tip: "Repousse le roi noir vers un bord avec la Dame en gardant une case d'écart (gare au pat !), puis amène ton Roi pour donner le mat.",
    fens: ['4k3/8/8/8/8/8/3Q4/4K3 w - - 0 1', '8/8/8/3k4/8/8/Q7/4K3 w - - 0 1'] },
  { id: 'r', name: 'Mater avec la Tour', goal: 'mate', tip: "La Tour coupe une rangée, ton Roi avance juste en face du roi noir (opposition). On le pousse vers le bord, puis mat.",
    fens: ['4k3/8/8/8/8/8/3R4/4K3 w - - 0 1', '8/8/8/4k3/8/8/7R/4K3 w - - 0 1'] },
  { id: 'rr', name: "L'échelle (deux Tours)", goal: 'mate', tip: "Une Tour bloque la rangée du roi, l'autre monte d'un cran pour le repousser. On alterne : c'est le mat le plus simple.",
    fens: ['4k3/8/8/8/8/8/R6R/4K3 w - - 0 1', '8/8/4k3/8/8/8/RR6/4K3 w - - 0 1'] },
  { id: 'p', name: 'Pousser le pion à Dame', goal: 'promote', tip: "Place ton Roi DEVANT le pion et prends l'opposition pour ouvrir le passage. Objectif : promouvoir le pion en Dame.",
    fens: ['4k3/8/4K3/4P3/8/8/8/8 w - - 0 1', '2k5/8/2K5/2P5/8/8/8/8 w - - 0 1'] },
];
async function bestUciFor(fen, depth) {
  try { const eng = getSF(); const ok = await eng.whenReady(); if (ok) { const r = await eng.evaluate(fen, depth); if (r && r.bestUci) return r.bestUci; } } catch (e) {}
  const r2 = egBest(fen, 3, 280); return r2 && r2.move ? (r2.move.from + r2.move.to + (r2.move.promotion || '')) : null;
}

function EndgamesView() {
  const [egi, setEgi] = useState(-1);
  const [fenIdx, setFenIdx] = useState(0);
  const [history, setHistory] = useState([]);
  const [selected, setSelected] = useState(null);
  const [targets, setTargets] = useState([]);
  const [status, setStatus] = useState('playing');
  const [thinking, setThinking] = useState(false);
  const [hint, setHint] = useState(null);
  const runRef = useRef(0);

  const eg = egi >= 0 ? ENDGAMES[egi] : null;
  const startFen = eg ? eg.fens[fenIdx % eg.fens.length] : START_FEN;
  const game = replayFrom(startFen, history);
  const fen = game.fen();
  const turn = game.turn();
  const ck = checkSq(fen);
  const lm = (() => { try { const h = game.history({ verbose: true }); return h.length ? { from: h[h.length - 1].from, to: h[h.length - 1].to } : null; } catch (e) { return null; } })();
  const moveCount = Math.ceil(history.length / 2);
  const canMove = status === 'playing' && !thinking && turn === 'w';

  function resetPos() { setHistory([]); setStatus('playing'); setSelected(null); setTargets([]); setHint(null); setThinking(false); runRef.current++; }
  function startEg(i) { setEgi(i); setFenIdx(0); setHistory([]); setStatus('playing'); setSelected(null); setTargets([]); setHint(null); setThinking(false); runRef.current++; }
  function nextPos() { runRef.current++; setFenIdx(f => (f + 1) % (eg ? eg.fens.length : 1)); setHistory([]); setStatus('playing'); setSelected(null); setTargets([]); setHint(null); setThinking(false); }

  function selectSq(g, sq) { const ms = g.moves({ square: sq, verbose: true }); setSelected(sq); setTargets(ms.map(m => m.to)); }
  function onSquare(sq) {
    if (!canMove) return;
    const g = replayFrom(startFen, history);
    if (g.turn() !== 'w') return;
    setHint(null);
    if (selected) {
      if (sq === selected) { setSelected(null); setTargets([]); return; }
      if (targets.includes(sq)) {
        const mv = safeMove(g, { from: selected, to: sq, promotion: 'q' });
        if (mv) { setSelected(null); setTargets([]); commitPlayer([...history, mv.san]); return; }
      }
      const p = g.get(sq);
      if (p && p.color === 'w') { selectSq(g, sq); return; }
      setSelected(null); setTargets([]); return;
    }
    const p = g.get(sq);
    if (p && p.color === 'w') selectSq(g, sq);
  }

  async function commitPlayer(nh) {
    setHistory(nh);
    const token = ++runRef.current;
    const g = replayFrom(startFen, nh);
    if (g.isCheckmate()) { setStatus('won'); return; }
    if (g.isStalemate()) { setStatus('stalemate'); return; }
    const last = nh[nh.length - 1] || '';
    if (eg.goal === 'promote' && last.indexOf('=') >= 0) { setStatus('won'); return; }
    if (isOver(g)) { setStatus('draw'); return; }
    setThinking(true);
    const uci = await bestUciFor(g.fen(), 12);
    if (token !== runRef.current) return;
    setThinking(false);
    if (!uci) return;
    const g2 = replayFrom(startFen, nh);
    const mv = safeMove(g2, { from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci.length > 4 ? uci[4] : undefined });
    if (!mv) return;
    const nh2 = [...nh, mv.san];
    setHistory(nh2);
    const g3 = replayFrom(startFen, nh2);
    if (g3.isStalemate()) { setStatus('stalemate'); return; }
    if (isOver(g3)) { setStatus('draw'); return; }
  }

  async function doHint() {
    if (!canMove) return;
    const g = replayFrom(startFen, history);
    if (g.turn() !== 'w') return;
    setThinking(true);
    const uci = await bestUciFor(g.fen(), 14);
    setThinking(false);
    if (uci) { const f = uci.slice(0, 2), t = uci.slice(2, 4); setSelected(f); setTargets([t]); setHint({ from: f, to: t }); }
  }

  if (!eg) {
    return (
      <div className="view">
        <h2 className="sec">Finales</h2>
        <p className="lead">Entraîne les finales gagnantes contre Stockfish, qui défend au mieux. Tu joues les Blancs ; un bouton « Indice » t'aide si tu bloques.</p>
        <div className="ogroup">
          {ENDGAMES.map((e, i) => (
            <button key={e.id} className="card ocard" onClick={() => startEg(i)}>
              <div className="ocard-t">{e.name}</div>
              <div className="ocard-d">{e.tip}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="view explorer">
      <button className="back" onClick={() => setEgi(-1)}>← Toutes les finales</button>
      <div className="card openname-card">
        <div className="hot-k">{eg.goal === 'promote' ? 'Objectif : promouvoir' : 'Objectif : mat'}</div>
        <div className="openname">{eg.name}</div>
        <p className="ptext">{eg.tip}</p>
      </div>

      <Board fen={fen} orientation="w" selected={selected} targets={targets} lastMove={lm} checkSquare={ck} hintSquare={hint ? hint.to : null} onSquareClick={onSquare} disabled={!canMove} />

      <div className={'egstatus ' + (status === 'won' ? 'ok' : (status === 'stalemate' || status === 'draw') ? 'warn' : '')}>
        {status === 'won' ? (eg.goal === 'promote' ? '✓ Pion promu en Dame — bien joué !' : '✓ Échec et mat — bien joué !')
          : status === 'stalemate' ? '⚠ Pat : le roi n\'a plus aucun coup légal, la partie est nulle. Réessaie en lui laissant toujours une case.'
            : status === 'draw' ? '⚠ Nulle (50 coups ou matériel insuffisant). Réessaie.'
              : thinking ? 'Stockfish défend…' : (eg.goal === 'promote' ? 'À toi (Blancs) — fais passer ton pion.' : 'À toi (Blancs) — mate le roi noir.')}
      </div>

      <div className="row gap egctrl">
        <button className="btn btn-ghost" onClick={doHint} disabled={!canMove}>💡 Indice</button>
        <button className="btn btn-ghost" onClick={resetPos}>↺ Rejouer</button>
        {eg.fens.length > 1 && <button className="btn btn-ghost" onClick={nextPos}>Position suivante</button>}
      </div>
      <div className="dim egmeta">Coups joués : {moveCount}</div>
    </div>
  );
}

// ===== App =====
export default function App() {
  const [tab, setTab] = useState('ouvertures');
  const [st, setSt] = useState(loadState);
  const [pzIdx, setPzIdx] = useState(0);

  useEffect(() => { injectFonts(); try { document.title = 'Gambit — échecs débutant'; } catch (e) {} }, []);
  function update(updater) { setSt(prev => { const next = updater(prev); saveState(next); return next; }); }

  const masterOpening = (id) => update(p => bumpStreak({ ...p, mastered: p.mastered.includes(id) ? p.mastered : [...p.mastered, id] }));
  const puzzleAttempt = (id) => update(p => p.tried.includes(id) ? p : { ...p, tried: [...p.tried, id], attempts: p.attempts + 1 });
  const puzzleSolved = (id, clean) => update(p => { const first = !p.solved.includes(id); return bumpStreak({ ...p, solved: first ? [...p.solved, id] : p.solved, clean: (first && clean) ? p.clean + 1 : p.clean }); });
  const resetProgress = () => { const f = freshState(); setSt(f); saveState(f); };

  return (
    <div className="gambit-app">
      <style>{CSS}</style>
      <div className="bgglow" />
      <div className="shell">
        <header className="hdr">
          <div className="logo"><img alt="" src={pieceImg('wN')} /></div>
          <div className="hdr-txt">
            <h1 className="title-grad">Gambit</h1>
            <div className="tagline">Échecs pour débuter · ouvertures &amp; tactiques</div>
          </div>
          <div className="streakchip" title="Série de jours">🔥 {st.streak}</div>
        </header>
        <main className="content">
          {tab === 'principes' && <PrinciplesView />}
          {tab === 'ouvertures' && <OuverturesView st={st} onMaster={masterOpening} />}
          {tab === 'tactiques' && <TacticsView st={st} pzIdx={pzIdx} setPzIdx={setPzIdx} onAttempt={puzzleAttempt} onSolved={puzzleSolved} />}
          {tab === 'finales' && <EndgamesView />}
          {tab === 'analyse' && <AnalyseView />}
          {tab === 'progres' && <ProgressView st={st} onReset={resetProgress} />}
        </main>
      </div>
      <nav className="dock">
        {TABS.map(t => (
          <button key={t.id} className={'dockb ' + (tab === t.id ? 'on' : '')} onClick={() => { setTab(t.id); }}>
            <span className="dicon">{t.icon}</span>
            <span className="dlbl">{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

// ===== Styles =====
const CSS = `
@property --beam-a { syntax:'<angle>'; inherits:false; initial-value:0deg; }
.gambit-app{
  --bg:#08080c; --panel:rgba(255,255,255,.05); --panel2:rgba(255,255,255,.08);
  --line:rgba(255,255,255,.10); --txt:#f2f1f5; --muted:#9a9aa6;
  --gold:#e6c168; --gold2:#f6e2a6; --good:#86d9a6; --bad:#f1948f;
  --sqL:#e9d6ad; --sqD:#9b7a4d;
  font-family:'Satoshi',-apple-system,BlinkMacSystemFont,system-ui,sans-serif;
  color:var(--txt); background:var(--bg); min-height:100vh;
  -webkit-font-smoothing:antialiased; position:relative; overflow-x:hidden;
}
.gambit-app *{ box-sizing:border-box; }
.gambit-app button{ font-family:inherit; cursor:pointer; }
.mono{ font-family:'JetBrains Mono',ui-monospace,monospace; }
.dim{ color:var(--muted); font-size:12px; }
.bgglow{ position:fixed; inset:0; pointer-events:none; z-index:0;
  background:
    radial-gradient(60% 40% at 50% -5%, rgba(230,193,104,.14), transparent 70%),
    radial-gradient(50% 30% at 90% 100%, rgba(230,193,104,.06), transparent 70%); }
.shell{ position:relative; z-index:1; max-width:480px; margin:0 auto; padding:calc(18px + env(safe-area-inset-top)) 16px calc(132px + env(safe-area-inset-bottom)); }

.hdr{ display:flex; align-items:center; gap:12px; margin:6px 2px 20px; }
.logo{ width:42px; height:42px; border-radius:13px; display:grid; place-items:center; flex:0 0 auto;
  background:linear-gradient(150deg, rgba(230,193,104,.22), rgba(230,193,104,.05));
  border:1px solid rgba(230,193,104,.35); box-shadow:0 6px 22px rgba(0,0,0,.4); }
.logo img{ width:30px; height:30px; filter:drop-shadow(0 1px 1px rgba(0,0,0,.4)); }
.hdr-txt{ flex:1 1 auto; min-width:0; }
.title-grad{ margin:0; font-family:'Clash Display','Satoshi',sans-serif; font-weight:700; font-size:30px; letter-spacing:-.02em; line-height:1;
  background:linear-gradient(100deg,var(--gold) 0%,var(--gold2) 28%,#fff7e2 50%,var(--gold2) 72%,var(--gold) 100%);
  background-size:200% auto; -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; color:transparent;
  animation:grad 6s linear infinite; }
@keyframes grad{ to{ background-position:200% center; } }
.tagline{ font-family:'Fraunces',Georgia,serif; font-style:italic; color:var(--muted); font-size:13px; margin-top:4px; }
.streakchip{ flex:0 0 auto; font-family:'JetBrains Mono',monospace; font-size:13px; font-weight:600; padding:7px 11px; border-radius:11px;
  background:var(--panel); border:1px solid var(--line); }

.content{ animation:fade .35s ease; }
@keyframes fade{ from{ opacity:0; transform:translateY(6px); } to{ opacity:1; transform:none; } }
.view{ display:flex; flex-direction:column; gap:14px; }
.sec{ font-family:'Clash Display',sans-serif; font-weight:600; font-size:19px; letter-spacing:-.01em; margin:6px 2px 0; }
.sec.nomar{ margin:0; }
.lead{ color:var(--muted); font-size:13.5px; line-height:1.55; margin:-4px 2px 2px; }

.card{ background:var(--panel); border:1px solid var(--line); border-radius:18px; padding:16px;
  box-shadow:0 1px 0 rgba(255,255,255,.04) inset, 0 10px 30px rgba(0,0,0,.25); backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); }

.hot{ background:linear-gradient(155deg, rgba(230,193,104,.16), rgba(230,193,104,.04)); border-color:rgba(230,193,104,.32); }
.hot-k{ font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:.14em; text-transform:uppercase; color:var(--gold2); }
.hot-t{ font-family:'Clash Display',sans-serif; font-weight:600; font-size:18px; margin:8px 0 6px; line-height:1.25; }
.hot-x{ margin:0; font-size:13.5px; line-height:1.6; color:#e6e5ec; }

.plist{ display:flex; flex-direction:column; gap:10px; }
.pcard{ display:flex; gap:14px; align-items:flex-start; padding:14px 16px; }
.pnum{ flex:0 0 auto; width:30px; height:30px; border-radius:9px; display:grid; place-items:center; font-weight:600; font-size:14px;
  color:var(--gold2); background:rgba(230,193,104,.12); border:1px solid rgba(230,193,104,.28); }
.ptitle{ font-weight:600; font-size:15px; margin-bottom:3px; }
.ptext{ margin:0; font-size:13px; line-height:1.55; color:var(--muted); }

.olist{ display:flex; flex-direction:column; gap:12px; }
.ocard{ text-align:left; width:100%; transition:transform .18s ease, border-color .18s ease, background .18s ease; }
.ocard:hover{ transform:translateY(-2px); border-color:rgba(230,193,104,.4); background:var(--panel2); }
.ocard:active{ transform:translateY(0); }
.ocard-t{ font-family:'Clash Display',sans-serif; font-weight:600; font-size:17px; margin:11px 0 4px; }
.ocard-d{ font-size:13px; color:var(--muted); line-height:1.5; }
.cchip{ font-size:11px; font-weight:600; padding:4px 9px; border-radius:999px; letter-spacing:.02em; }
.cchip.cw{ background:rgba(255,255,255,.9); color:#1a1a22; }
.cchip.cb{ background:rgba(20,20,26,.9); color:#f2f1f5; border:1px solid var(--line); }
.masterbadge{ font-size:11px; font-weight:600; color:#0c1a12; background:var(--good); padding:4px 9px; border-radius:999px; }

.back{ background:none; border:none; color:var(--muted); font-size:13px; padding:2px 0; align-self:flex-start; }
.back:hover{ color:var(--txt); }
.ohead{ margin-bottom:2px; }
.otitle{ font-family:'Clash Display',sans-serif; font-weight:700; font-size:23px; letter-spacing:-.01em; margin:10px 0 6px; }
.odesc{ margin:0; font-size:13.5px; line-height:1.6; color:var(--muted); }

.trainer{ display:flex; flex-direction:column; gap:12px; }
.seg{ display:inline-flex; background:var(--panel); border:1px solid var(--line); border-radius:11px; padding:3px; }
.segb{ border:none; background:none; color:var(--muted); font-size:13px; font-weight:600; padding:7px 14px; border-radius:8px; transition:.16s; }
.segb.on{ background:linear-gradient(135deg,#d9b45a,#f2d898); color:#241c08; }
.progbar{ height:5px; border-radius:99px; background:rgba(255,255,255,.08); overflow:hidden; }
.progbar>div{ height:100%; border-radius:99px; background:linear-gradient(90deg,var(--gold),var(--gold2)); transition:width .35s ease; }

.board{ position:relative; width:100%; aspect-ratio:1/1; display:grid; grid-template-columns:repeat(8,1fr); grid-template-rows:repeat(8,1fr);
  border-radius:14px; overflow:hidden; box-shadow:0 18px 50px rgba(0,0,0,.5); }
.beam{ isolation:isolate; }
.beam::before{ content:''; position:absolute; inset:-2px; border-radius:16px; padding:2px; z-index:2; pointer-events:none;
  background:conic-gradient(from var(--beam-a), transparent 0 66%, rgba(246,226,166,.9) 82%, var(--gold) 92%, transparent 100%);
  -webkit-mask:linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite:xor; mask-composite:exclude;
  animation:spin 5s linear infinite; }
@keyframes spin{ to{ --beam-a:360deg; } }
.sq{ position:relative; }
.sq.l{ background:var(--sqL); } .sq.d{ background:var(--sqD); }
.sq.dis{ cursor:default; }
.pc{ position:absolute; inset:0; width:100%; height:100%; filter:drop-shadow(0 2px 2px rgba(0,0,0,.35)); z-index:1; user-select:none; }
.ov{ position:absolute; inset:0; pointer-events:none; }
.ov-last{ box-shadow:inset 0 0 0 3px rgba(230,193,104,.6); animation:pulse 1.1s ease-out; }
@keyframes pulse{ 0%{ box-shadow:inset 0 0 0 8px rgba(230,193,104,0); } 100%{ box-shadow:inset 0 0 0 3px rgba(230,193,104,.6); } }
.ov-sel{ background:rgba(230,193,104,.34); box-shadow:inset 0 0 0 3px rgba(246,226,166,.85); }
.ov-hint{ box-shadow:inset 0 0 0 4px var(--gold2); animation:hint 1s ease infinite; z-index:2; }
@keyframes hint{ 50%{ box-shadow:inset 0 0 0 4px rgba(246,226,166,.35); } }
.ov-check{ background:radial-gradient(circle, rgba(241,90,90,.85) 0%, rgba(241,90,90,.35) 45%, transparent 72%); }
.ov-cap{ box-shadow:inset 0 0 0 4px rgba(230,193,104,.7); border-radius:0; }
.dot{ position:absolute; top:50%; left:50%; width:26%; height:26%; transform:translate(-50%,-50%); border-radius:50%; background:rgba(230,193,104,.62); z-index:1; }
.coord{ position:absolute; font-family:'JetBrains Mono',monospace; font-size:9px; font-weight:600; z-index:1; }
.cf{ right:3px; bottom:1px; } .cr{ left:3px; top:1px; }
.sq.l .coord{ color:rgba(90,68,32,.72); } .sq.d .coord{ color:rgba(241,224,182,.85); }

.turnline{ display:flex; align-items:center; gap:9px; font-size:13px; color:var(--muted); }
.turn-dot{ width:11px; height:11px; border-radius:50%; flex:0 0 auto; }
.turn-dot.tw{ background:#fff; box-shadow:0 0 0 2px rgba(255,255,255,.2); }
.turn-dot.tb{ background:#16161c; border:1px solid var(--line); }
.turn-dot.ok{ background:var(--good); }
.fb{ font-size:13.5px; line-height:1.55; padding:12px 14px; border-radius:13px; border:1px solid var(--line); background:var(--panel); }
.fb-good{ border-color:rgba(134,217,166,.4); background:rgba(134,217,166,.1); color:#cdeede; }
.fb-bad{ border-color:rgba(241,148,143,.4); background:rgba(241,148,143,.1); color:#f6cfcc; }
.fb-muted{ color:var(--muted); }

.row{ display:flex; } .row.between{ justify-content:space-between; } .row.center{ align-items:center; }
.row.gap{ gap:10px; } .mb{ margin-bottom:12px; } .mt{ margin-top:14px; }
.btn{ border:1px solid var(--line); border-radius:12px; padding:12px 18px; font-size:14px; font-weight:600; color:var(--txt); background:var(--panel); transition:.16s; }
.btn-ghost:hover{ background:var(--panel2); }
.btn-primary{ position:relative; overflow:hidden; border:none; color:#241c08; background:linear-gradient(135deg,#d9b45a,#f2d898); box-shadow:0 8px 22px rgba(230,193,104,.22); }
.btn-primary::after{ content:''; position:absolute; inset:0; background:linear-gradient(110deg,transparent 32%,rgba(255,255,255,.55) 50%,transparent 68%); transform:translateX(-130%); animation:shim 3.4s ease-in-out infinite; }
@keyframes shim{ 0%,55%{ transform:translateX(-130%); } 100%{ transform:translateX(130%); } }
.btn-primary:active{ transform:translateY(1px); }

.log{ display:flex; flex-direction:column; gap:2px; max-height:230px; overflow-y:auto; margin-top:2px;
  border:1px solid var(--line); border-radius:14px; padding:8px; background:rgba(0,0,0,.18); }
.logrow{ display:grid; grid-template-columns:34px 56px 1fr; gap:8px; align-items:baseline; padding:7px 6px; border-radius:9px; }
.logrow.cur{ background:rgba(230,193,104,.1); }
.lognum{ font-size:12px; color:var(--muted); text-align:right; }
.logsan{ font-size:13px; font-weight:600; color:var(--gold2); }
.lognote{ font-size:12.5px; line-height:1.45; color:#d7d6de; }

.tag{ font-size:11px; font-weight:600; letter-spacing:.06em; text-transform:uppercase; color:var(--gold2);
  background:rgba(230,193,104,.12); border:1px solid rgba(230,193,104,.28); padding:5px 10px; border-radius:999px; }

.grid2{ display:grid; grid-template-columns:1fr 1fr; gap:12px; }
.statcard{ display:flex; flex-direction:column; align-items:center; gap:6px; text-align:center; padding:18px 12px; }
.statn{ font-size:20px; font-weight:600; } .statn.big{ font-size:30px; }
.statl{ font-size:12px; color:var(--muted); }
.statwide{ padding:18px 16px; }
.ring{ display:block; } .ring-bg{ fill:none; stroke:rgba(255,255,255,.1); stroke-width:7; }
.ring-fg{ fill:none; stroke:url(#g); stroke-width:7; stroke-linecap:round; transition:stroke-dashoffset .6s ease; stroke:var(--gold); }
.streakcard{ display:flex; flex-direction:column; align-items:center; gap:2px; text-align:center; padding:24px;
  background:linear-gradient(160deg, rgba(230,193,104,.14), rgba(230,193,104,.03)); border-color:rgba(230,193,104,.3); }
.flame{ font-size:30px; } .bignum{ font-size:50px; font-weight:600; line-height:1; letter-spacing:-.02em; }
.biglbl{ font-size:14px; color:var(--muted); } .subnum{ font-size:12px; color:var(--gold2); margin-top:6px; }
.chips{ display:flex; flex-wrap:wrap; gap:8px; }
.chip{ font-size:12.5px; padding:6px 11px; border-radius:999px; background:rgba(230,193,104,.12); border:1px solid rgba(230,193,104,.26); color:var(--gold2); }
.resetbtn{ background:none; border:none; color:var(--muted); font-size:12.5px; padding:6px; align-self:center; text-decoration:underline; text-underline-offset:3px; }
.resetbtn:hover{ color:var(--bad); }

.dock{ position:fixed; left:50%; bottom:16px; transform:translateX(-50%); z-index:20; display:flex; gap:3px; padding:6px;
  width:calc(100vw - 16px); max-width:440px; justify-content:space-between;
  background:rgba(16,16,22,.72); border:1px solid var(--line); border-radius:20px; backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px);
  box-shadow:0 12px 40px rgba(0,0,0,.5); }
.dockb{ display:flex; flex-direction:column; align-items:center; gap:3px; border:none; background:none; color:var(--muted);
  padding:8px 1px; border-radius:13px; transition:.18s; flex:1 1 0; min-width:0; }
.dockb .dicon{ display:grid; place-items:center; height:22px; }
.dockb .knish{ width:21px; height:21px; opacity:.6; filter:grayscale(1) brightness(1.4); transition:.18s; }
.dlbl{ font-size:9.5px; font-weight:600; letter-spacing:0; white-space:nowrap; }
.dockb.on{ color:#241c08; background:linear-gradient(135deg,#d9b45a,#f2d898); }
.dockb.on .knish{ opacity:1; filter:none; }

@media (prefers-reduced-motion: reduce){
  .title-grad,.beam::before,.btn-primary::after,.ov-last,.ov-hint,.content{ animation:none !important; }
}
.gambit-app button:focus-visible{ outline:2px solid var(--gold2); outline-offset:2px; }
.sq:focus-visible{ outline:none; }

/* Ouvertures: segmented top + groups */
.seg-top{ display:flex; width:100%; }
.seg-top .segb{ flex:1; text-align:center; }
.btn:disabled{ opacity:.4; cursor:default; }
.ogroup{ display:flex; flex-direction:column; gap:10px; }
.ogrp{ font-size:12px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--muted); margin:6px 2px 0; }

/* Explorer */
.explorer{ display:flex; flex-direction:column; gap:14px; }
.openname-card{ display:flex; flex-direction:column; gap:4px; padding:13px 16px; }
.openname{ font-family:'Fraunces',Georgia,serif; font-size:18px; font-weight:600; color:var(--txt); line-height:1.2; }
.booklbl{ font-size:11px; letter-spacing:.08em; text-transform:uppercase; margin:0 2px 8px; }
.booklist{ display:flex; flex-wrap:wrap; gap:8px; }
.bookchip{ display:flex; flex-direction:column; align-items:flex-start; gap:1px; padding:8px 12px; border-radius:12px;
  background:var(--panel); border:1px solid var(--line); color:var(--txt); transition:.16s; }
.bookchip:hover{ border-color:rgba(230,193,104,.45); background:var(--panel2); transform:translateY(-1px); }
.bookchip.main{ border-color:rgba(230,193,104,.55); background:rgba(230,193,104,.1); }
.bcsan{ font-size:14px; font-weight:700; color:var(--gold2); }
.bcname{ font-size:10.5px; color:var(--muted); max-width:150px; }
.histline{ display:flex; flex-wrap:wrap; gap:3px 8px; font-size:12.5px; color:var(--txt);
  background:rgba(0,0,0,.18); border:1px solid var(--line); border-radius:14px; padding:11px 13px; line-height:1.7; }
.hmv{ display:inline-flex; align-items:baseline; gap:4px; }
.hn{ color:var(--gold2); font-weight:700; }
.hs{ color:var(--txt); }

/* Explorer analysis card */
.analysis{ display:flex; flex-direction:column; gap:10px; padding:13px 16px;
  border-color:rgba(230,193,104,.32); background:linear-gradient(180deg,rgba(230,193,104,.07),var(--panel)); }
.ana-wait{ font-size:13px; }
.ana-rows{ display:flex; flex-direction:column; gap:9px; }
.ana-row{ display:flex; align-items:center; justify-content:space-between; gap:12px; }
.alabel{ font-size:13px; color:var(--txt); font-weight:600; }
.alabel .dim{ font-weight:400; font-size:12px; }
.anachip{ padding:7px 14px; }
.areply{ font-size:14px; font-weight:700; color:var(--gold2); padding:7px 12px; border:1px dashed var(--line); border-radius:11px; }

/* Elo level selector */
.elorow{ display:flex; flex-direction:column; gap:8px; }
.elolbl{ font-size:13px; font-weight:600; color:var(--txt); }
.elonow{ font-size:12px; color:var(--gold2); }
.elochips{ display:flex; gap:6px; }
.elochip{ flex:1; text-align:center; padding:8px 0; border-radius:10px; font-size:13px; font-weight:700;
  color:var(--muted); background:var(--panel); border:1px solid var(--line); transition:.16s; }
.elochip:hover{ color:var(--txt); border-color:rgba(230,193,104,.4); }
.elochip.on{ color:#241c08; background:linear-gradient(135deg,#d9b45a,#f2d898); border-color:transparent; }

/* ===== Analyse (chess.com review) ===== */
.gold{ color:var(--gold2); }
.tiny{ font-size:11px; line-height:1.45; margin-top:8px; }
.full{ width:100%; }
.btn-ghost{ background:rgba(255,255,255,.04); border:1px solid var(--line); color:var(--txt); }
.btn-ghost:hover{ border-color:rgba(230,193,104,.4); }
.fb{ font-size:13px; line-height:1.5; padding:11px 14px; border-radius:13px; border:1px solid var(--line); }
.loadcard{ display:flex; flex-direction:column; gap:11px; }
.flbl{ font-size:12px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:var(--muted); }
.tin{ flex:1; min-width:0; background:rgba(0,0,0,.25); border:1px solid var(--line); border-radius:12px; color:var(--txt);
  font-size:15px; padding:11px 13px; outline:none; }
.tin:focus{ border-color:rgba(230,193,104,.5); }
.linklike{ align-self:flex-start; background:none; border:none; color:var(--gold2); font-size:13px; text-decoration:underline; text-underline-offset:3px; padding:2px 0; }
.pastebox{ display:flex; flex-direction:column; gap:9px; }
.tarea{ width:100%; resize:vertical; background:rgba(0,0,0,.25); border:1px solid var(--line); border-radius:12px; color:var(--txt);
  font-family:'JetBrains Mono',monospace; font-size:12px; line-height:1.5; padding:11px 13px; outline:none; }
.tarea:focus{ border-color:rgba(230,193,104,.5); }

.gamelist{ display:flex; flex-direction:column; gap:8px; }
.gamerow{ display:flex; align-items:center; gap:12px; text-align:left; padding:12px 14px; }
.gamerow:hover{ border-color:rgba(230,193,104,.4); background:var(--panel2); }
.rdot{ width:9px; height:9px; border-radius:50%; flex:0 0 auto; }
.rdot.rw{ background:var(--good); } .rdot.rd{ background:var(--muted); } .rdot.rl{ background:var(--bad); }
.grow-main{ flex:1; min-width:0; display:flex; flex-direction:column; gap:2px; }
.grow-t{ font-size:14px; font-weight:600; color:var(--txt); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.grow-s{ font-size:11.5px; }
.gres{ font-size:12px; font-weight:700; flex:0 0 auto; }
.gres.gw{ color:var(--good); } .gres.gd{ color:var(--muted); } .gres.gl{ color:var(--bad); }

.ghead{ display:flex; flex-direction:column; gap:3px; padding:13px 16px; }
.gh-title{ font-family:'Fraunces',Georgia,serif; font-size:17px; font-weight:600; color:var(--txt); }
.gh-sub{ font-size:12px; }

.pbar{ height:8px; border-radius:999px; background:rgba(255,255,255,.08); overflow:hidden; margin-top:10px; }
.pbar-fg{ height:100%; background:linear-gradient(90deg,var(--gold),var(--gold2)); transition:width .25s ease; }

.navrow{ gap:8px; }
.navrow .btn{ padding:9px 0; flex:1; font-size:15px; }
.navnum{ font-size:12.5px; flex:0 0 auto; min-width:54px; text-align:center; }

.accrow{ display:flex; align-items:center; justify-content:space-around; gap:10px; padding:18px 16px; }
.acccol{ display:flex; flex-direction:column; align-items:center; gap:3px; }
.accnum{ font-size:30px; font-weight:800; line-height:1; color:var(--txt); font-family:'Clash Display','Satoshi',sans-serif; }
.acclbl{ font-size:12px; color:var(--txt); }
.accvs{ font-size:10px; letter-spacing:.12em; text-transform:uppercase; }

.evalgraph{ width:100%; height:62px; display:block; margin-top:10px; border-radius:10px; overflow:hidden; cursor:pointer; background:rgba(0,0,0,.25); }
.eg-wtop{ fill:rgba(255,255,255,.05); } .eg-wbot{ fill:rgba(0,0,0,.28); }
.eg-mid{ stroke:rgba(255,255,255,.18); stroke-width:.5; }
.eg-line{ fill:none; stroke:var(--gold2); stroke-width:1.4; vector-effect:non-scaling-stroke; }
.eg-cursor{ stroke:var(--gold); stroke-width:1; vector-effect:non-scaling-stroke; opacity:.85; }

.keymo{ display:flex; align-items:center; gap:10px; width:100%; text-align:left; background:none; border:none; padding:9px 2px; border-top:1px solid var(--line); }
.keymo:first-of-type{ border-top:none; }
.km-txt{ font-size:13px; color:var(--txt); }

.movelist{ display:flex; flex-direction:column; max-height:340px; overflow-y:auto; border:1px solid var(--line); border-radius:14px; background:rgba(0,0,0,.18); }
.mlrow{ display:flex; align-items:center; gap:9px; padding:8px 12px; background:none; border:none; border-bottom:1px solid rgba(255,255,255,.05); text-align:left; }
.mlrow:last-child{ border-bottom:none; }
.mlrow.on{ background:rgba(230,193,104,.12); }
.ml-n{ width:30px; flex:0 0 auto; font-size:12px; }
.ml-san{ width:64px; flex:0 0 auto; font-size:13.5px; font-weight:700; color:var(--txt); }
.ml-best{ font-size:12px; }

.badge{ font-size:10.5px; font-weight:700; padding:2px 8px; border-radius:999px; white-space:nowrap; flex:0 0 auto; }
.b-book{ color:#bcd0e8; background:rgba(140,170,210,.16); }
.b-best{ color:#0c1a12; background:var(--good); }
.b-exc{ color:#bfe9cf; background:rgba(134,217,166,.18); }
.b-good{ color:#cdd6cf; background:rgba(255,255,255,.08); }
.b-inacc{ color:#f0d98a; background:rgba(230,200,90,.16); }
.b-mistake{ color:#f2bd86; background:rgba(230,150,70,.18); }
.b-blunder{ color:#241008; background:var(--bad); }

.flipbtn{ align-self:center; margin-top:-4px; background:rgba(255,255,255,.04); border:1px solid var(--line); color:var(--muted);
  font-size:12.5px; font-weight:600; padding:7px 16px; border-radius:999px; transition:.16s; }
.flipbtn:hover{ color:var(--txt); border-color:rgba(230,193,104,.4); }

/* Finales */
.egstatus{ text-align:center; font-size:13.5px; font-weight:600; color:var(--txt); padding:11px 14px; border-radius:13px;
  background:var(--panel); border:1px solid var(--line); line-height:1.45; }
.egstatus.ok{ color:#bfe9cf; background:rgba(134,217,166,.12); border-color:rgba(134,217,166,.4); }
.egstatus.warn{ color:#f0d98a; background:rgba(230,200,90,.1); border-color:rgba(230,200,90,.4); }
.egctrl{ flex-wrap:wrap; }
.egctrl .btn{ flex:1; min-width:120px; padding:11px 10px; }
.egmeta{ text-align:center; font-size:12px; margin-top:-4px; }
`;
