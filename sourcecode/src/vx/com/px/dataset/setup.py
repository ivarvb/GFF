
#https://medium.com/@xpl/protecting-python-sources-using-cython-dcd940bb188e
import setuptools  # important
from distutils.core import Extension, setup
from Cython.Build import cythonize

from Cython.Distutils import build_ext

#cimport numpy as np
import numpy



# define an extension that will be cythonized and compiled
extensions = [
        Extension(
            name="dataio",
            sources=["DataIO.pyx"],
#            libraries=[],
            #library_dirs=["/usr/local/lib/","/usr/lib"],
            language="c",
            include_dirs=[numpy.get_include()]
            ),
            
        #and other extension
#        Extension(name="csegmentation", sources=["CSegmentation.pyx"],
#        library_dirs=["/usr/local/lib/","/usr/lib"],
#        extra_compile_args = ["-I/usr/include/igraph -L/usr/include/lib -ligraph"],
#        extra_link_args = ["-I/usr/include/igraph -L/usr/include/lib -ligraph"],
#        language="c++"),
        
    ]
setup(
    name = 'DataIO',
    cmdclass = {'build_ext': build_ext},
    ext_modules=cythonize(extensions)
)
