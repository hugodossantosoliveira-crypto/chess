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
const IconKnight = () => (<img className="knish" alt="" src={pieceImg('wN')} />);
const TABS = [
  { id: 'principes', label: 'Principes', icon: <IconBook /> },
  { id: 'ouvertures', label: 'Ouvertures', icon: <IconKnight /> },
  { id: 'tactiques', label: 'Tactiques', icon: <IconBolt /> },
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

function OpeningsView({ st, openId, setOpenId, onMaster }) {
  const op = OPENINGS.find(o => o.id === openId);
  if (op) {
    return (
      <div className="view">
        <button className="back" onClick={() => setOpenId(null)}>← Toutes les ouvertures</button>
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
  return (
    <div className="view">
      <h2 className="sec">Ouvertures pour débuter</h2>
      <p className="lead">Apprends les idées (mode lecture), puis rejoue-les de mémoire (mode entraînement). Pas du par-cœur : comprends le « pourquoi » de chaque coup.</p>
      <div className="olist">
        {OPENINGS.map(o => (
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

// ===== App =====
export default function App() {
  const [tab, setTab] = useState('ouvertures');
  const [st, setSt] = useState(loadState);
  const [openOpening, setOpenOpening] = useState(null);
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
          {tab === 'ouvertures' && <OpeningsView st={st} openId={openOpening} setOpenId={setOpenOpening} onMaster={masterOpening} />}
          {tab === 'tactiques' && <TacticsView st={st} pzIdx={pzIdx} setPzIdx={setPzIdx} onAttempt={puzzleAttempt} onSolved={puzzleSolved} />}
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
.shell{ position:relative; z-index:1; max-width:480px; margin:0 auto; padding:18px 16px 130px; }

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

.dock{ position:fixed; left:50%; bottom:16px; transform:translateX(-50%); z-index:20; display:flex; gap:4px; padding:7px;
  background:rgba(16,16,22,.72); border:1px solid var(--line); border-radius:20px; backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px);
  box-shadow:0 12px 40px rgba(0,0,0,.5); }
.dockb{ display:flex; flex-direction:column; align-items:center; gap:3px; border:none; background:none; color:var(--muted);
  padding:8px 14px; border-radius:14px; transition:.18s; min-width:62px; }
.dockb .dicon{ display:grid; place-items:center; height:22px; }
.dockb .knish{ width:21px; height:21px; opacity:.6; filter:grayscale(1) brightness(1.4); transition:.18s; }
.dlbl{ font-size:10.5px; font-weight:600; letter-spacing:.01em; }
.dockb.on{ color:#241c08; background:linear-gradient(135deg,#d9b45a,#f2d898); }
.dockb.on .knish{ opacity:1; filter:none; }

@media (prefers-reduced-motion: reduce){
  .title-grad,.beam::before,.btn-primary::after,.ov-last,.ov-hint,.content{ animation:none !important; }
}
.gambit-app button:focus-visible{ outline:2px solid var(--gold2); outline-offset:2px; }
.sq:focus-visible{ outline:none; }
`;
