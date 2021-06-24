I = csvread("public/mask.csv");
I = uint8(I) == 1;

imwrite(I, "public/mask.png");