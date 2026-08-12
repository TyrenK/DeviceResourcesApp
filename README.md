# DeviceResourcesApp

Aplicativo para acessar recursos do dispositivo, como contatos, câmera e galeria de imagens.

## Instalação

### 1. Criar ou acessar o projeto

Abra o terminal na pasta do projeto:

```bash
cd DeviceResourcesApp

### 2. Instalar as dependências

```bash
npm install

```

```bash
npx expo install expo-contacts expo-image-picker @expo/vector-icons react-native-safe-area-context

```

```bash
npx expo start

```
## Permissões

O arquivo app.json configura as permissões necessárias para utilização dos recursos do dispositivo.

```bash
"ios": {
    "infoPlist": 
    "NSPhotoLibraryUsageDescription": "Este aplicativo precisa acessar sua galeria de fotos.",
    "NSContactsUsageDescription": "Este aplicativo precisa acessar seus contatos."
"android": {
    "permissions": 
        "READ_CONTACTS",
        "WRITE_CONTACTS",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "CAMERA"
```


