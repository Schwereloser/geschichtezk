# Geschichte-Zeitstrahl

## Mit Docker Compose starten

Docker und das Docker-Compose-Plugin müssen installiert und der Docker-Dienst gestartet sein.

```sh
docker compose up --build -d
```

Die Anwendung ist anschließend unter <http://localhost:8080> erreichbar. Der Host-Port kann über die Umgebungsvariable `PORT` geändert werden. Änderungen am Quellcode erfordern einen erneuten Build mit demselben Befehl.

Zum Stoppen und Entfernen des Containers:

```sh
docker compose down
```

Die Anwendung wird beim Image-Build erstellt und anschließend über den Node.js/Express-Server ausgeliefert. Für den integrierten **KI-Erklärer** wird die Umgebungsvariable `GEMINI_API_KEY` benötigt (z. B. `GEMINI_API_KEY=... docker compose up --build -d`).
