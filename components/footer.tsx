import React from "react";
import NextLink from "next/link";
import { Facebook, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-black text-white">
      {/* Top section with main content */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="space-y-4">
            <img
              src="/logo-akkar.png"
              alt="Akkar Motors Logo"
              className="h-8 mb-4"
            />
            <p className="text-gray-400 text-sm">
              Excelência em carros de luxo e alto padrão. Sua satisfação é nossa prioridade.
            </p>
          </div>

          {/* Links úteis */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-200">Links Úteis</h3>
            <ul className="space-y-2">
              <li>
                <NextLink href="/estoque" className="text-gray-400 hover:text-white transition-colors">
                  Nosso Estoque
                </NextLink>
              </li>
              <li>
                <NextLink href="/sobre" className="text-gray-400 hover:text-white transition-colors">
                  Sobre Nós
                </NextLink>
              </li>
            </ul>
          </div>

          {/* Endereço */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-200">Localização</h3>
            <div className="space-y-2 text-gray-400">
              <p>Av. Orosimbo Maia, 2042</p>
              <p>Cambuí, Campinas, SP</p>
              <p>CEP 13024-045</p>
            </div>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-200">Contato</h3>
            <div className="space-y-2">
              <p className="text-gray-400">
                <span className="block">Telefone:</span>
                <a href="tel:+551932510331" className="hover:text-white transition-colors">
                  (19) 3251-0331
                </a>
              </p>
              <p className="text-gray-400">
                <span className="block">Email:</span>
                <a href="mailto:vendas@akkarmotors.com.br" className="hover:text-white transition-colors">
                  vendas@akkarmotors.com.br
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8" />

        {/* Bottom section with social media */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex space-x-6">
            <NextLink
              href="https://www.facebook.com/akkarmotors"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5" />
            </NextLink>
            <NextLink
              href="https://www.instagram.com/akkarmotors/"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </NextLink>
            <NextLink
              href="https://www.youtube.com/channel/UCWzvvsZpl_6oA8c03Q_Ynzg"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="YouTube"
            >
              <Youtube className="w-5 h-5" />
            </NextLink>
          </div>
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Akkar Motors. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
