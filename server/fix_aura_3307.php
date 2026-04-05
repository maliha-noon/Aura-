<?php
$host = '127.0.0.1';
$port = '3307';
$user = 'root';
$pass = '';

try {
    echo "Connecting to $host:$port...\n";
    $pdo = new PDO("mysql:host=$host;port=$port", $user, $pass);
    echo "SUCCESS!\n";
    
    echo "Ensuring 'aura' database exists...\n";
    $pdo->exec("CREATE DATABASE IF NOT EXISTS aura");
    echo "DONE.\n";
    
    echo "Verifying 'aura' access...\n";
    $pdo->exec("USE aura");
    echo "Aura DB is ready on port 3307.\n";

} catch (PDOException $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    exit(1);
}
?>
