// Función para copiar la IP al portapapeles
function copyIp() {
    const ipText = document.getElementById("serverIp").innerText;
    navigator.clipboard.writeText(ipText).then(() => {
        alert("¡IP copiada al portapapeles: " + ipText);
    }).catch(err => {
        console.error("Error al copiar: ", err);
    });
}

// Configuración e integración de datos para los creadores de Twitch
const channels = ['isrra_0', 'gayo_10', 'kissukey', 'eldanyelon'];

async function checkTwitchStreams() {
    const clientId = 'kimne78kx3ncx6br8h642ac6ms2nc'; // Client ID público de Twitch

    for (const channel of channels) {
        try {
            const response = await fetch('https://gql.twitch.tv/gql', {
                method: 'POST',
                headers: {
                    'Client-ID': clientId,
                },
                body: JSON.stringify([{
                    operationName: "GetItem",
                    variables: { login: channel },
                    query: `query GetItem($login: String!) {
                        user(login: $login) {
                            profileImageURL(width: 300)
                            stream {
                                type
                                viewersCount
                            }
                        }
                    }`
                }])
            });

            const data = await response.json();
            const userData = data[0]?.data?.user;

            if (userData) {
                // Actualizar foto de perfil real
                if (userData.profileImageURL) {
                    document.getElementById(`avatar-${channel}`).src = userData.profileImageURL;
                }

                // Verificar si está EN VIVO
                if (userData.stream && userData.stream.type === 'live') {
                    document.getElementById(`live-${channel}`).style.display = 'block';
                    document.getElementById(`off-${channel}`).style.display = 'none';
                    document.getElementById(`status-${channel}`).innerText = `👥 ${userData.stream.viewersCount} espectadores`;
                    document.getElementById(`status-${channel}`).style.color = '#52b788';
                }
            }
        } catch (error) {
            console.error(`Error al cargar datos de ${channel}:`, error);
        }
    }
}

// Consultar estado al cargar la página
checkTwitchStreams();