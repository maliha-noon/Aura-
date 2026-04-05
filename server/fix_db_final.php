<?php
$dsn = "mysql:host=127.0.0.1;port=3306";
$user = 'root';
$pass = '';

try {
    echo "Connecting to $dsn as $user...\n";
    $pdo = new PDO($dsn, $user, $pass, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    echo "SUCCESS!\n";
    
    echo "Ensuring database 'aura' exists...\n";
    $pdo->exec("CREATE DATABASE IF NOT EXISTS aura");
    echo "Database 'aura' is ready.\n";
    
    echo "Verifying 'root' permissions...\n";
    // Many local setups don't need this, but let's try a simple query on the new DB
    $pdo->exec("USE aura");
    $pdo->exec("CREATE TABLE IF NOT EXISTS connection_test (id INT)");
    $pdo->exec("DROP TABLE connection_test");
    echo "Read/Write permissions verified on 'aura'.\n";

} catch (PDOException $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    exit(1);
}
?>
