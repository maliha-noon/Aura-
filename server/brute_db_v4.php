<?php
$hosts = ['127.0.0.1', 'localhost', '[::1]'];
$ports = ['3306', '3307'];
$passwords = ['', 'password', 'root'];
$user = 'root';
$db = 'aura';

foreach ($hosts as $host) {
    foreach ($ports as $port) {
        foreach ($passwords as $pass) {
            try {
                $dsn = "mysql:host=$host;port=$port;dbname=$db";
                echo "Trying: $dsn... ";
                $pdo = new PDO($dsn, $user, $pass, [PDO::ATTR_TIMEOUT => 1]);
                echo "SUCCESS!\n";
                exit(0);
            } catch (PDOException $e) {
                echo "FAILED: " . ($e->getCode() === '42000' ? "Unknown DB" : $e->getMessage()) . "\n";
            }
        }
    }
}
echo "All combinations failed.\n";
exit(1);
?>
