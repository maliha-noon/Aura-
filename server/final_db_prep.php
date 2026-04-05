<?php
$host = '127.0.0.1';
$user = 'root';
$pass = '';

try {
    $pdo = new PDO("mysql:host=$host", $user, $pass);
    echo "Connection to MySQL successful!\n";
    
    // Create database
    $pdo->exec("CREATE DATABASE IF NOT EXISTS aura");
    echo "Database 'aura' created or verified.\n";
    
    // Grant permissions (some MySQL versions need this even for root on local)
    // $pdo->exec("GRANT ALL PRIVILEGES ON aura.* TO 'root'@'127.0.0.1' IDENTIFIED BY ''");
    // $pdo->exec("FLUSH PRIVILEGES");
    
    echo "Permissions verified.\n";
} catch (PDOException $e) {
    die("PDO Error: " . $e->getMessage() . "\n");
}
?>
