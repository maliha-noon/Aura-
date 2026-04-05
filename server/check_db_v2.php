<?php
$host = '127.0.0.1';
$user = 'root';
$pass = 'password';
$db = 'aura';

try {
    $pdo = new PDO("mysql:host=$host", $user, $pass);
    echo "Connection to MySQL host successful!\n";
    $pdo->exec("CREATE DATABASE IF NOT EXISTS $db");
    echo "Database '$db' checked/created.\n";
    $pdo->query("USE $db");
    echo "Using database '$db'.\n";
    $query = $pdo->query("SHOW TABLES");
    echo "Tables in '$db':\n";
    while ($row = $query->fetch(PDO::FETCH_NUM)) {
        echo "- $row[0]\n";
    }
} catch (PDOException $e) {
    echo "PDO Error: " . $e->getMessage() . "\n";
    echo "Error Code: " . $e->getCode() . "\n";
}
?>
