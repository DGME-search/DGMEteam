body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
}

header {
    display: flex;
    align-items: center;
    margin: 20px;
}

h1 {
    margin: 0 10px;
}

input[type="text"] {
    padding: 5px;
    font-size: 16px;
}

button {
    padding: 5px 10px;
    font-size: 16px;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th, td {
    border: 1px solid #ddd;
    padding: 8px;
}

@media (max-width: 600px) {
    header {
        flex-direction: column;
    }

    input[type="text"] {
        width: 100%;
        margin-top: 10px;
    }
}
