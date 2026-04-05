<?php
$hosts = ['127.0.0.1', 'localhost', '[::1]', ''];
$passwords = ['', 'password', 'root'];
$user = 'root';

foreach ($hosts as $host) {
    foreach ($passwords as $pass) {
        try {
            $dsn = "mysql:user=$user";
            if ($host) $dsn .= ";host=$host";
            echo "Trying: $dsn, pass='$pass'... ";
            $pdo = new PDO($dsn, $user, $pass, [PDO::ATTR_TIMEOUT => 1]);
            echo "SUCCESS!\n";
            exit(0);
        } catch (PDOException $e) {
            echo "FAILED: " . $e->getMessage() . "\n";
        }
    }
}
echo "All combinations failed.\n";
exit(1);
?>
