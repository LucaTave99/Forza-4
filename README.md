# <img src="./public/connect4.PNG" alt="connect4" width="150"/> \
Forza 4

Progetto di Tecnologie Internet --- Luca Taverna - Giulia Oddi

## Avvio del gioco

Nella directory del progetto, con:

### `npm install`

Vengono installati tutti i moduli necessari.

### `npm start`

Avvia l'applicazione in modalità sviluppatore.\
Aprendo [http://localhost:3000](http://localhost:3000) viene visualizzato il gioco nel browser.

## Panoramica del gioco

Il progetto, realizzato in JavaScript con il supporto del framework React, è una piattaforma
web che permette ad alcuni utenti di giocare a Forza 4 in modalità peer-to-peer.
La comunicazione peer-to-peer è stata gestita tramite la libreria PeerJs di JavaScript che
permette di creare delle entità peer in grado di comunicare tra di loro. Infatti, il server è
utilizzato solo per la creazione dei peer nel momento in cui essi si connettono al gioco e per
mettere in comunicazione le due entità. Lo scambio di informazioni necessarie per la
partita avviene direttamente tramite le due entità peer.

## Il gioco

Il gioco è una rappresentazione virtuale del classico gioco Forza 4 e quindi è stato realizzato
tramite una griglia, rappresentata da una matrice di 6 righe x 7 colonne. Ogni giocatore
deve avere la possibilità di inserire una sola pedina per ogni turno di gioco, dopodiché il
turno passa al giocatore avversario. Per inserire una pedina il giocatore deve toccare sulla
colonna desiderata e sarà il sistema a valutare e inserire la pedina nella prima cella libera
dal basso.
Per identificare e differenziare i due giocatori sono state scelte due pedine di colori
differenti: il colore rosso è stato scelto per il peer che inizia la comunicazione e che quindi
effettuerà la prima mossa nella partita, invece, al secondo peer è stato assegnato il colore
giallo. Vince il primo utente che riesce a mettere in fila 4 pedine, che possono essere
disposte in verticale, in orizzontale, oppure nelle diagonali.
Il gioco può concludersi con la vittoria di un giocatore, oppure con un pareggio nel caso in
cui tutte le celle risultino piene, ma senza la presenza di 4 pedine uguali in fila. Al termine
del gioco viene chiesto ai peer se vogliono giocare un’altra partita, in tal caso entrambi
vengono reindirizzati alla pagina di connessione nella quale devono inserire l’id
dell’avversario.

