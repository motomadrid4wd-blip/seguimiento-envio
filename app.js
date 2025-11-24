// ---- Formatear fecha fea del backend a formato español ----
function formatearFecha(fechaString) {
    const fecha = new Date(fechaString.replace(" ", "T"));
    return fecha.toLocaleString("es-ES", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
    });
}

// ---- Función principal ----
async function consultar() {

    const input = document.getElementById("alb").value.trim();
    const div = document.getElementById("resultado");

    if (!input) {
        div.innerHTML = "<p>Por favor, introduce un número de albarán.</p>";
        return;
    }

    // Añadir los 000 automáticamente
    const referencia = "000" + input;

    div.innerHTML = "<p>Consultando…</p>";

    try {
        const response = await fetch(`https://tipsa-correos-api.onrender.com/pedido/${referencia}`);
        const data = await response.json();

        if (data.error) {
            div.innerHTML = `<p>No se encontró información para este pedido.</p>`;
            return;
        }

        const empresa = data.empresa;
        const estado = data.estado;
        const fecha = data.fecha;
        const numero_envio = data.numero_envio;

        // ---- Cabecera general ----
        let html = `
            <h3>Resumen de tu envío</h3>
            <p><strong>Transportista:</strong> ${empresa}</p>
            <p><strong>Último estado:</strong> ${estado}</p>
            <p><strong>Fecha:</strong> ${formatearFecha(fecha)}</p>
        `;

        // ---- CORREOS ----
        if (empresa.toUpperCase().trim() === "CORREOS") {
            html += `
                <p>Puedes consultar todos los estados del envío en:</p>
                <a href="https://www.correos.es/es/es/particulares" target="_blank">Web de Correos</a>
                <p><strong>Número:</strong> ${numero_envio}</p>
            `;
        }

        // ---- TIPSA (cualquier formato: TIPSA, TIPSA 19, tipSa 07 ...) ----
        else if (empresa && empresa.toUpperCase().trim().startsWith("TIPSA")) {

            const numero_tipsa = "028001028001" + numero_envio;

            html += `
                <p>Puedes consultar todos los estados del envío en:</p>
                <a href="https://www.tip-sa.com/es/localizacion-envios" target="_blank">Web de TIPSA</a>
                <p><strong>Número de seguimiento:</strong> ${numero_tipsa}</p>
            `;
        }

        // ---- CBL ----
        else if (empresa.toUpperCase().trim() === "CBL") {
            html += `
                <p>Si tienes alguna consulta, puedes llamarnos:</p>
                <p><strong>+34 91 524 94 20</strong></p>
                <p>Horario:<br>
                8:30h – 14:00h y 15:00h – 17:30h<br>
                Viernes: 8:00h – 14:00h<br>
                Julio y Agosto: 8:00h – 15:00h</p>
            `;
        }

        div.innerHTML = html;

    } catch (error) {
        div.innerHTML = "<p>Error al conectar con el servidor.</p>";
        console.error(error);
    }
}

